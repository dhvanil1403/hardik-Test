const db = require("../config/dbConnection");

const showAvailableScreen = async () => {
    const query = `
    SELECT *
    FROM public.screens
ORDER BY screenid DESC;
  `;
    const { rows } = await db.query(query);
    return rows;
};
const showliveData = async () => {
    const query = `
      SELECT *
      FROM public.live ORDER BY id DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};
// const updateScreenWithLive = async (screenID, pairingCode, liveData) => {
//   const query = `
//   UPDATE public.screens
//   SET 
//     name = $1,
//     description = $2,
//     live1 = $3,
//     live2 = $4,
//     live3 = $5,
//     live4 = $6,
//     live5 = $7,
//     live6 = $8,
//     live7 = $9,
//     live8 = $10,
//     live9 = $11,
//     live10 = $12,
//     clock = $13,             -- Add clock field
//     weather = $14,           -- Add weather field
//     clock_runtime = $15     -- Add clock_runtime field
//   WHERE screenid = ANY($16::integer[]) 
//   AND pairingcode = ANY($17::text[]);
// `;
//   const values = [
//       liveData.name,
//       liveData.description,
//       liveData.live1,
//       liveData.live2,
//       liveData.live3,
//       liveData.live4,
//       liveData.live5,
//       liveData.live6,
//       liveData.live7,
//       liveData.live8,
//       liveData.live9,
//       liveData.live10,
//       liveData.clock,          // Add value for clock
//       liveData.weather,        // Add value for weather
//       liveData.clockRuntime,   // Add value for clock_runtime
//       screenID,
//       pairingCode,
//   ];
//   await db.query(query, values);
// };

const updateScreenWithLive = async (screenID, pairingCode, liveData) => {
  const query = `
  UPDATE public.screens
  SET 
    name = $1,
    description = $2,
    live1 = $3,
    live2 = $4,
    live3 = $5,
    live4 = $6,
    live5 = $7,
    live6 = $8,
    live7 = $9,
    live8 = $10,
    live9 = $11,
    live10 = $12,
    clock = $13,             -- Add clock field
    weather = $14,           -- Add weather field
    clock_runtime = $15,     -- Add clock_runtime field
    youtube_live = $16,      -- Add youtube_live field
    exoplayer = $17,         -- Add exoplayer field
    youtube_live_link = $18  -- Add youtube_live_link field
  WHERE screenid = ANY($19::integer[]) 
  AND pairingcode = ANY($20::text[]);
  `;
  const values = [
    liveData.name,
    liveData.description,
    liveData.live1,
    liveData.live2,
    liveData.live3,
    liveData.live4,
    liveData.live5,
    liveData.live6,
    liveData.live7,
    liveData.live8,
    liveData.live9,
    liveData.live10,
    liveData.clock,            // Add value for clock
    liveData.weather,          // Add value for weather
    liveData.clockRuntime,     // Add value for clock_runtime
    liveData.youtube_live,     // Add value for youtube_live
    liveData.exoplayer,        // Add value for exoplayer
    liveData.youtube_live_link, // Add value for youtube_live_link
    screenID,
    pairingCode,
  ];
  await db.query(query, values);
};
                                                                                


// const createLive = async (liveData) => {
//     const query = `
//       INSERT INTO public.live (screenid, pairingcode, name, description, live1, live2, live3, live4, live5, live6, live7, live8, live9, live10)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::text[]);
//     `;
//     const values = [
//         liveData.screenID, // Assuming screenID is already an array [301648, 301649, 301651]
//         liveData.pairingCode, // Assuming pairingCode is already an array ["Elec_go", "Elec_go", "Elec_go"]
//         liveData.name,
//         liveData.description,
//         liveData.live1,
//         liveData.live2,
//         liveData.live3,
//         liveData.live4,
//         liveData.live5,
//         liveData.live6,
//         liveData.live7,
//         liveData.live8,
//         liveData.live9,
//         liveData.live10,
//     ];
//     await db.query(query, values);
// };


// const createLive = async (liveData) => {  // important
//   const query = `
// INSERT INTO public.live (screenid, pairingcode, name, description, live1, live2, live3, live4, live5, live6, live7, live8, live9, live10, clock, weather, clock_runtime)
// VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::text[], $15, $16, $17);

//   `;

//   const values = [
//     liveData.screenID,
//     liveData.pairingCode,
//     liveData.name,
//     liveData.description,
//     liveData.live1,
//     liveData.live2,
//     liveData.live3,
//     liveData.live4,
//     liveData.live5,
//     liveData.live6,
//     liveData.live7,
//     liveData.live8,
//     liveData.live9,
//     liveData.live10,
//     liveData.clock, // Boolean
//     liveData.weather, // Boolean
//     liveData.clockRuntime, // Integer
// ];

//   console.log("Generated Query: ", query);
//   console.log("Values: ", values);
// console.log(" liveData.clock, liveData.weather,", liveData.clock, liveData.weather);

//   await db.query(query, values);
// };


const createLive = async (liveData) => {
  const query = `
INSERT INTO public.live (screenid, pairingcode, name, description, live1, live2, live3, live4, live5, live6, live7, live8, live9, live10, clock, weather, clock_runtime, youtube_live, exoplayer, youtube_live_link)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::text[], $15, $16, $17, $18, $19, $20);
`;

  const values = [
    liveData.screenID,
    liveData.pairingCode,
    liveData.name,
    liveData.description,
    liveData.live1,
    liveData.live2,
    liveData.live3,
    liveData.live4,
    liveData.live5,
    liveData.live6,
    liveData.live7,
    liveData.live8,
    liveData.live9,
    liveData.live10,
    liveData.clock, // Boolean
    liveData.weather, // Boolean
    liveData.clockRuntime, // Integer
    liveData.youtube_live, // Boolean
    liveData.exoplayer, // Boolean
    liveData.youtube_live_link, // Text
  ];

  console.log('Generated Query:', query);
  console.log('Values:', values);

  await db.query(query, values);
};






const getScreenIDsByLiveId = async (liveId) => {
    const query = `
      SELECT screenid
      FROM public.live
      WHERE id = $1;
    `;
    const values = [liveId];

    const result = await db.query(query, values);
    return result.rows.map(row => row.screenid);
};

const deleteLiveById = async (liveId) => {
    const query = `
      DELETE FROM public.live
      WHERE id = $1;
    `;
    const values = [liveId];

    const result = await db.query(query, values);
    return result.rows[0];
};

const updateScreensWithLive = async (screenIDs, liveData) => {
    const query = `
        UPDATE public.screens
        SET 
            name = $1,
            description = $2,
            live1 = $3,
            live2 = $4,
            live3 = $5,
            live4 = $6,
            live5 = $7,
            live6 = $8,
            live7 = $9,
            live8 = $10,
            live9 = $11,
            live10 = $12
        WHERE screenid = ANY($13::integer[]);                                         
    `;
    
    const values = [
        liveData ? liveData.name || null : null,
        liveData ? liveData.description || null : null,
        liveData ? liveData.live1 || null : null,
        liveData ? liveData.live2 || null : null,
        liveData ? liveData.live3 || null : null,
        liveData ? liveData.live4 || null : null,
        liveData ? liveData.live5 || null : null,
        liveData ? liveData.live6 || null : null,
        liveData ? liveData.live7 || null : null,
        liveData ? liveData.live8 || null : null,
        liveData ? liveData.live9 || null : null,
        liveData ? liveData.live10 || null : null,
        screenIDs
    ];

    await db.query(query, values);
};


const getliveDatabyId=async(liveId)=>{
    const query = `
    SELECT * FROM public.live
    WHERE id = $1;
  `;
  const values = [liveId];

  const result = await db.query(query, values);
  return result.rows[0];
}
module.exports = {
    showAvailableScreen,
    updateScreenWithLive,
    createLive, showliveData, getScreenIDsByLiveId, deleteLiveById, updateScreensWithLive,getliveDatabyId
};
