import { BlockadeLabsSdk } from '@blockadelabs/sdk';

const sdk = new BlockadeLabsSdk({
  api_key: T62CriiO6pr0BIQYPiHSSR18Y5BjNYXlt8DfIyKCKBoJGFddCqruTqaX14zk,
});

const generation = await sdk.generateSkybox({
  prompt: 'PROMPT_GOES_HERE', // Required
  skybox_style_id: 2, // Required
  webhook_url: 'YOUR_WEBHOOK_URL', // Optional
});

function init () {
    console.log("test");
    console.log(generation.log);
}
