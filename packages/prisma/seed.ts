import Stripe from 'stripe';

import prisma from './client';
import { Prisma } from '@prisma/client';

import { PRODUCT_FEEDBACK_FORM } from '../lib/forms/templates';
import { formToJsonSchema } from '../lib/forms/form-to-json-schema';
import { FormFieldSchema } from '../lib/types/dtos';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

async function main() {
  try {
    const products = await stripe.products.list();
    const prices = (await stripe.prices.list())?.data.filter(
      (data) => data.type === 'recurring'
    );

    await Promise.all(
      products.data.map((each) =>
        prisma.product.upsert({
          where: {
            id: each.id,
          },
          create: {
            id: each.id,
            name: each.name,
            description: each.description,
            active: each.active,
            image: each.images?.[0],
            metadata: each.metadata,
          },
          update: {
            name: each.name,
            description: each.description,
            active: each.active,
            image: each.images?.[0],
            metadata: each.metadata,
          },
        })
      )
    );

    await Promise.all(
      prices.map((each) =>
        prisma.price.upsert({
          where: {
            id: each.id,
          },
          create: {
            type: each.type as any,
            id: each.id,
            currency: each.currency,
            active: each.active,
            unitAmount: each.unit_amount,
            interval: each.recurring?.interval,
            interval_count: each.recurring?.interval_count,
            trial_period_days: each.recurring?.trial_period_days,
            product: {
              connect: {
                id: each.product as string,
              },
            },
          },
          update: {
            type: each.type as any,
            currency: each.currency,
            active: each.active,
            unitAmount: each.unit_amount,
            interval: each.recurring?.interval,
            interval_count: each.recurring?.interval_count,
            trial_period_days: each.recurring?.trial_period_days,
          },
        })
      )
    );

    const userId = 'clnol0gtc000208jlgp3p83av';
    const user2Id = 'clr5mfzec000108l5dwvv3ffb';
    const freeOrgId = 'clnokxi0p000008jlaxe24av9';
    const premiumOrgId = 'clnol6ij8000308jl1cky5hsy';
    const subscriptionId = 'clnolau4y000408jl08aqektv';
    const premiumAgentId = 'clrz0tn6h000108kxfyomdzxg';

    // await prisma.organization.update({
    //   where: {
    //     id: premiumOrgId,
    //   },
    //   data: {
    //     mailInboxes: {
    //       create: {
    //         alias: 'dev',
    //         fromName: 'Georges',
    //       },
    //     },
    //   },
    // });

    await prisma.user.upsert({
      where: {
        id: userId,
      },
      create: {
        id: userId,
        emailVerified: new Date(),
        email: 'dev@chatsappai.com',
        name: 'Georges',
        memberships: {
          create: [
            {
              role: 'OWNER',
              organization: {
                create: {
                  id: freeOrgId,
                  name: 'free',
                  apiKeys: {
                    create: {
                      key: '46e98f6d-edf6-4545-9f87-80d81fb24771',
                    },
                  },
                  usage: {
                    create: {},
                  },
                },
              },
            },
            {
              role: 'OWNER',
              organization: {
                create: {
                  id: premiumOrgId,
                  name: 'premium',
                  apiKeys: {
                    create: {
                      key: 'f7d3174f-4335-4a2b-bb02-416453ea2099',
                    },
                  },
                  usage: {
                    create: {},
                  },
                  subscriptions: {
                    create: {
                      id: subscriptionId,
                      status: 'active',
                      plan: 'level_3',
                      customerId: '42',
                      priceId: prices?.[0]?.id,
                    },
                  },
                  mailInboxes: {
                    create: {
                      name: 'Dev',
                      alias: 'dev',
                      fromName: 'Georges',
                    },
                  },
                },
              },
            },
          ],
        },
      },
      update: {
        name: 'Georges',
      },
    });

    await prisma.user.upsert({
      where: {
        id: user2Id,
      },
      create: {
        id: user2Id,
        emailVerified: new Date(),
        email: 'dev2@chatsappai.com',
        name: 'Adam',
        memberships: {
          create: [
            {
              role: 'USER',
              organizationId: premiumOrgId,
            },
          ],
        },
      },
      update: {
        name: 'Adam',
      },
    });

    const agentCreateProps = {
      id: premiumAgentId,
      name: 'Adam',
      description: 'ChatsappAIAI Agent for Customer Support',
      organization: {
        connect: {
          id: premiumOrgId,
        },
      },
      handle: 'adam',
      owner: {
        connect: {
          id: userId,
        },
      },
      systemPrompt: `Your name is Adam, and you are a Customer Support Specialist at ChatsappAI.com
As a customer support agent, please provide a helpful and professional response to the user's question or issue.
Support email is support@chatsappai.com
Answer briefly.
Inject humor, playfulness, and a spirited tone into the content. You can use emojies.`,
      userPrompt: '{query}',
      visibility: 'public',
      useMarkdown: true,
      restrictKnowledge: true,
      useLanguageDetection: true,
      useContextDataAgents: true,
    } as Prisma.AgentCreateInput;

    await prisma.agent.upsert({
      where: {
        id: premiumAgentId,
      },
      update: {
        ...agentCreateProps,
      },
      create: {
        ...agentCreateProps,
      },
    });

    const formConfig = {
      fields: PRODUCT_FEEDBACK_FORM.schema.fields,
      schema: formToJsonSchema(PRODUCT_FEEDBACK_FORM.schema.fields),
      startScreen: {
        title: 'Product Feedback',
        description: '',
      },
    };

    const formId = 'clupr4or2000108l41a4b75jw';
    await prisma.form.upsert({
      where: {
        id: formId,
      },
      create: {
        id: formId,
        name: 'Seed Form',
        organization: {
          connect: {
            id: premiumOrgId,
          },
        },
        publishedConfig: formConfig as any,
        draftConfig: formConfig as any,
        agent: {
          create: {
            hidden: true,
            restrictKnowledge: false,
            useMarkdown: false,
            useLanguageDetection: false,
            visibility: 'public',
            name: 'Hidden Agent',
            description: "Form's hidden agent",
            organizationId: premiumOrgId,
            tools: {
              create: {
                type: 'form',
                formId: formId,
              },
            },
          },
        },
      },
      update: {
        publishedConfig: formConfig as any,
        draftConfig: formConfig as any,
      },
    });
  } catch (err) {
    console.log('prisma seed err', err);
    throw err;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
