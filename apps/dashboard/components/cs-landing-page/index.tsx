import {
  ArrowsPointingOutIcon,
  ArrowTrendingUpIcon,
  Battery100Icon,
  BoltIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  FaceSmileIcon,
  HandRaisedIcon,
  HandThumbUpIcon,
  LanguageIcon,
  LightBulbIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { useColorScheme } from '@mui/joy';
import Head from 'next/head';
import React, { useEffect } from 'react';

import Cta from '../landing-page/Cta';
import FAQ from '../landing-page/FAQ';
import { Footer } from '../landing-page/Footer';
import Languages from '../landing-page/Languages';
import PartnerLogos from '../PartnerLogos';
import SEO from '../SEO';

import Body from './Body';
import Feature from './Feature';
import { Header } from './Header';
import Hero from './Hero';

type Props = {};

function CSLandingPage({}: Props) {
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode('dark');
  }, []);

  return (
    <>
      <SEO
        title="Resolve AI - Resolve 50% of your support tickets instantly"
        description="Resolve AI brings a no-code platform to create custom AI chatbots trained on your data. Our solution makes customer support easy and simplifies team workflow."
        baseUrl="https://www.resolveai.io"
        ogImage="https://www.chatsappai.com/api/og"
        uri="/"
      />

      {/* <Header /> */}

      {/* <script
        defer
        src="https://cdn.jsdelivr.net/npm/@databerry/chat-bubble@latest"
        id="clq6g5cuv000wpv8iddswwvnd"
        data-name="databerry-chat-bubble"
      ></script> */}

      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            width: 100dvw;
            max-width: 100d%;
            overflow-x: hidden;
          }
          `,
          }}
        />
      </Head>

      {/* <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `import Chatbox from 'https://cdn.jsdelivr.net/npm/@chatsappai/embeds@1.0.231/dist/chatbox/index.min.js';

  Chatbox.initBubble({
    agentId: 'clq6g5cuv000wpv8iddswwvnd',
  });`,
        }}
      /> */}

      <Body />

      <Footer disableProductColumn />
    </>
  );
}

export default CSLandingPage;
