document.addEventListener('DOMContentLoaded', () => {
  try {
    const me = document.querySelector(
      'script[data-name="databerry-chat-bubble"]'
    );

    if (!me?.id) {
      console.warn('[CHAINDESK]: missing Agent ID');
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
    import Chatbox from 'https://cdn.jsdelivr.net/npm/@chatsappai/embeds@1.0.231/dist/chatbox/index.min.js';

    Chatbox.initBubble({
      agentId: '${me?.id}',
    });
`;
    document.body.appendChild(script);
  } catch (error) {
    console.error(error);
  }
});
