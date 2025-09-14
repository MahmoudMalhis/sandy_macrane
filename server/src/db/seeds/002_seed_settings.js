export async function seed (knex) {
  // Delete existing entries
  await knex("settings").del();

  // Insert seed entries
  await knex("settings").insert([
    {
      key: "whatsapp_owner",
      value: "970599123456",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      key: "social_links",
      value: JSON.stringify({
        instagram: "https://instagram.com/sandy_macrame",
        facebook: "https://facebook.com/sandy.macrame",
        whatsapp: "https://wa.me/970599123456",
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      key: "site_meta",
      value: JSON.stringify({
        title: "ساندي مكرمية - Sandy Macrame",
        description: "أجمل أعمال المكرمية والبراويز اليدوية من ساندي مكرمية",
        keywords: "مكرمية, براويز, ساندي, يدوية, فلسطين",
        logo: "/images/logo.png",
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      key: "home_slider",
      value: JSON.stringify({
        macrame: {
          title: "أعمال مكرمية فريدة",
          subtitle: "اكتشف جمال المكرمية اليدوية",
          button_text: "شاهد أعمال المكرمية",
          image: "/images/macrame-cover.jpg",
        },
        frames: {
          title: "براويز رائعة التصميم",
          subtitle: "براويز فنية تضفي جمالاً لمنزلك",
          button_text: "شاهد البراويز",
          image: "/images/frames-cover.jpg",
        },
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
