import Replicate from "replicate";

export async function generateReplicateImgae(
  imageUri: string,
  style: string,
  prompt: string
) {
  const replicate = new Replicate();

  const input = {
    image: imageUri,
    style: style,
    prompt: prompt,
    instant_id_strength: 0.8,
  }
  const prediction = await replicate.predictions.create({
    version: "fofr/face-to-many:35cea9c3164d9fb7fbd48b51503eabdb39c9d04fdaef9a68f368bed8087ec5f9",
    input 
  })


  let completed;
  while (!completed) {
    const latest = await replicate.predictions.get(prediction.id);
    if (latest.status !== "starting" && latest.status !== "processing") {
      completed = latest
      break; // Exit the loop when the condition is met
    }
    // Wait for 2 seconds before the next iteration if the condition is not met
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log(completed?.output);

  return completed ? prediction.output : null
}

// export async function handler(req: any, res: any) {
//   const response = await fetch("https://api.replicate.com/v1/predictions", {
//     method: "POST",
//     headers: {
//       Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       // Pinned to a specific version of Stable Diffusion
//       // See https://replicate.com/stability-ai/sdxl
//       version:
//         "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",

//       // This is the text prompt that will be submitted by a form on the frontend
//       input: { prompt: req.body.prompt },
//     }),
//   });

//   if (response.status !== 201) {
//     let error = await response.json();
//     res.statusCode = 500;
//     res.end(JSON.stringify({ detail: error.detail }));
//     return;
//   }

//   const prediction = await response.json();
//   res.statusCode = 201;
//   res.end(JSON.stringify(prediction));
// }

// export async function receiptHandler(req: any, res: any) {
//   const response = await fetch(
//     "https://api.replicate.com/v1/predictions/" + req.query.id,
//     {
//       headers: {
//         Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   if (response.status !== 200) {
//     let error = await response.json();
//     res.statusCode = 500;
//     res.end(JSON.stringify({ detail: error.detail }));
//     return;
//   }

//   const prediction = await response.json();
//   res.end(JSON.stringify(prediction));
// }



// import Replicate from 'replicate';

// const replicate = new Replicate();

// const input = {
//     image: "https://replicate.delivery/pbxt/KW7Getr2zD5ECxySdBZtLmPa322lNkXrpkMdKcmxeaDmq2b1/MTk4MTczMTkzNzI1Mjg5NjYy.webp",
//     style: "Clay",
//     prompt: "a person in a post apocalyptic war game",
//     instant_id_strength: 0.8
// };

// const output = await replicate.run("fofr/face-to-many:35cea9c3164d9fb7fbd48b51503eabdb39c9d04fdaef9a68f368bed8087ec5f9", { input });
// console.log(output)
// //=> ["https://replicate.delivery/pbxt/R1ayGe5efoQbaoRzgDEJdLs...
