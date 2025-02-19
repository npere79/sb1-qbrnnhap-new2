import Replicate from 'replicate';

// Replace with your API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testSchnell() {
  try {
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: "A beautiful sunset over a calm ocean",
        negative_prompt: "",
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        seed: 0
      }
    });

    console.log("Waiting for image generation...");
    
    let result;
    while (true) {
      result = await replicate.predictions.get(prediction.id);
      if (result.status === "succeeded" || result.status === "failed") {
        break;
      }
      console.log("Status:", result.status);
      await sleep(1000);
    }
    
    if (result.status === "succeeded") {
      console.log("Generated image URLs:");
      result.output.forEach((url, index) => {
        console.log(`Image ${index + 1}:`, url);
      });
    } else {
      console.log("Generation failed");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSchnell();
