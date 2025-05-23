import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Button, Card, ColorPaletteProp } from '@mui/joy';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import type { ConversationStatus } from '@chaindesk/prisma';
import { ChatContext } from '@chaindesk/ui/hooks/useChat';
import useStateReducer from '@chaindesk/ui/hooks/useStateReducer';
import { updateConversationStatus } from './ResolveButton';

// import { InjectLeadForm, LEAD_FORM_ID } from './LeadForm';import React from 'react'

type Props = {};

function RequestHumanButton({}: Props) {
  const {
    conversationId,
    conversationStatus,
    visitorEmail,
    refreshConversation,
  } = useContext(ChatContext);
  const { t } = useTranslation();

  const [state, setState] = useStateReducer({
    isHumanRequestLoading: false,
  });

  return (
    <Button
      size="sm"
      variant="outlined"
      disabled={conversationStatus === 'HUMAN_REQUESTED'}
      loading={state.isHumanRequestLoading}
      sx={{
        whiteSpace: 'nowrap',
      }}
      color="warning"
      startDecorator={<AccountCircleRoundedIcon />}
      onClick={async () => {
        try {
          setState({
            isHumanRequestLoading: true,
          });

          await updateConversationStatus(conversationId, 'HUMAN_REQUESTED');
          await refreshConversation();
        } catch {
        } finally {
          setState({
            isHumanRequestLoading: false,
          });
        }
      }}
    >
      {
        (
          {
            ['HUMAN_REQUESTED']: 'Asistencia de operador humano',
            ['RESOLVED']: `${t('chatbubble:actions.request')}`,
            ['UNRESOLVED']: `${t('chatbubble:actions.request')}`,
          } as Record<ConversationStatus, string>
        )[conversationStatus]
      }
    </Button>
  );
}

export default RequestHumanButton;
