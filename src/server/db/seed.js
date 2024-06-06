const db = require("./client");
const { createUser } = require("./users");

const loremIpsum = require("lorem-ipsum").loremIpsum;

// Generate Lorem Ipsum text
const loremText = loremIpsum({
  count: 1, // Number of "words", "sentences", or "paragraphs" to generate
  units: "paragraphs", // Generate paragraphs of text
  sentenceLowerBound: 5, // Minimum number of words per sentence
  sentenceUpperBound: 15, // Maximum number of words per sentence
  paragraphLowerBound: 1, // Minimum number of sentences per paragraph
  paragraphUpperBound: 5, // Maximum number of sentences per paragraph
});

const dropTables = async () => {
  try {
    await db.query(/*sql*/ `
        
        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS categories;
        `);
  } catch (err) {
    throw err;
  }
};

//---------------------------------------------------------TABLES DEFINITION---------------------------------------------------------
const createTables = async () => {
  try {
    await db.query(/*sql*/ `
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT false
  );
  CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );
  CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    category_id INTEGER REFERENCES categories(id) NOT NULL,
    imageURL VARCHAR(1000) 
  );
  CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    review_text VARCHAR(1000),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    item_id INTEGER REFERENCES items(id),
    user_id INTEGER REFERENCES users(id),
    CONSTRAINT unique_review UNIQUE (item_id, user_id)
  );
  CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment_text VARCHAR(1000),
    review_id INTEGER REFERENCES reviews(id),
    user_id INTEGER REFERENCES users(id)
  );

        `);
  } catch (err) {
    throw err;
  }
};

//---------------------------------------------------------USERS SEED DATA---------------------------------------------------------
const users = [
  {
    username: "Emily Johnson",
    email: "emily@example.com",
    password: "securepass",
    is_admin: false,
  },
  {
    username: "A",
    email: "a@a.com",
    password: "a",
    is_admin: false,
  },
  {
    username: "Isabella García",
    email: "bella@example.com",
    password: "pass1234",
    is_admin: false,
  },
  {
    username: "Mohammed Ahmed",
    email: "mohammed@example.com",
    password: "mysecretpassword",
    is_admin: false,
  },
  {
    username: "John Smith",
    email: "john@example.com",
    password: "password123",
    is_admin: false,
  },
  {
    username: "Chloe Speshock",
    email: "cespeshock@gmail.com",
    password: "thisisasecret",
    is_admin: true,
  },
];

//---------------------------------------------------------INSERT USERS function---------------------------------------------------------
const insertUsers = async () => {
  try {
    for (const user of users) {
      await createUser({
        username: user.username,
        email: user.email,
        password: user.password,
        is_admin: user.is_admin,
      });
    }
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

//---------------------------------------------------------CATEGORIES SEED DATA---------------------------------------------------------
const categories = [
  { name: "Backpack" },
  { name: "Tent" },
  { name: "Hiking Boots" },
  { name: "Cookware" },
  { name: "Sleeping Bag" },
  { name: "Water Bottle" },
];

//---------------------------------------------------------CREATE CATEGORY function---------------------------------------------------------
const createCategory = async ({ name }) => {
  try {
    const {
      rows: [category],
    } = await db.query(
      /*sql*/
      `
          INSERT INTO categories(name)
          VALUES($1)
          RETURNING *`,
      [name]
    );
    return category;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------INSERT CATEGORIES function---------------------------------------------------------
const insertCategories = async () => {
  try {
    for (const category of categories) {
      await createCategory({
        name: category.name,
      });
    }
    console.log("categories seeded");
  } catch (error) {
    console.error("error seeding categories", error);
  }
};

//---------------------------------------------------------ITEMS SEED DATA ends after row 700------------------------------
const items = [
  {
    title: "Gregory multi-day backpack",
    description: "A great multi-day pack for taking on the trails",
    category_id: 1,
    imageURL: "bp1.png",
  },
  {
    title: "REI multi-day backpack",
    description: "Backpack ideal for long trecks in the wilderness",
    category_id: 1,
    imageURL: "bp2.png",
  },
  {
    title: "Blue Gregory multi-day backpack",
    description: "our classic Gregory multi-day pack, now in blue!",
    category_id: 1,
    imageURL: "bp3.png",
  },
  {
    title: "Green REI multi-day backpack",
    description:
      "Durable, waterproof backpack for multiple nights and long hikes",
    category_id: 1,
    imageURL: "bp4.png",
  },
  {
    title: "Blue REI multi-day backpack",
    description: "The classic REI multi-day backpack in a fashionable blue!",
    category_id: 1,
    imageURL: "bp5.png",
  },
  {
    title: "Green Osprey multi-day backpack",
    description:
      "This Osprey pack is great for several days on a trecherous trail.",
    category_id: 1,
    imageURL: "bp6.png",
  },
  {
    title: "Black and blue MultiGear multi-day backpack",
    description: "Waterproof, easy to clean, and lightweight",
    category_id: 1,
    imageURL: "bp7.png",
  },
  {
    title: "Brown Osprey multi-day backpack",
    description:
      "the classic Osprey in brown, weatherproof and blends in with nature",
    category_id: 1,
    imageURL: "bp8.png",
  },
  {
    title: "Teal Osprey multi-day backpack",
    description: "the classic multi-day trail pack in teal",
    category_id: 1,
    imageURL: "bp9.png",
  },
  {
    title: "Brown and Green MultiGear multi-day backpack",
    description:
      "Waterproof, weatherproof, dirtproof, everything proof.  It's green!",
    category_id: 1,
    imageURL: "bp10.png",
  },
  {
    title: "REI single-day backpack",
    description: "single-day hikers pack, 20L capacity",
    category_id: 1,
    imageURL: "bp11.png",
  },
  {
    title: "light brown/orange REI single-day backpack",
    description: "classic single-day pack in light brown/orange",
    category_id: 1,
    imageURL: "bp12.png",
  },
  {
    title: "Gray Osprey single-day backpack",
    description: "Waterproof daypack perfect for long single-day hikes",
    category_id: 1,
    imageURL: "bp13.png",
  },
  {
    title: "Ocean Blue Gregory single-day backpack",
    description: "Waterproof 20L lightweight daypack",
    category_id: 1,
    imageURL: "bp14.png",
  },
  {
    title: "Dark Green Osprey single-day backpack",
    description:
      "The classic Osprey single-day pack in dark green. 20L capacity",
    category_id: 1,
    imageURL: "bp15.png",
  },
  {
    title: "Orange/red Patagonia single-day backpack",
    description:
      "The Bougie Patagonia hikers pak in a sophisticated orange/red for those who want stand out and look rich. #patagucci",
    category_id: 1,
    imageURL: "bp16.png",
  },
  {
    title: "Black and Gray Camelback single-day backpack",
    description:
      "single-day hiking backpack, comes with 32oz camelback water bladder.  Stay hydrated!",
    category_id: 1,
    imageURL: "bp17.png",
  },
  {
    title: "Brown Columbia hiking boot",
    description: "the utmost classic hiking boot.  Classic brown.",
    category_id: 3,
    imageURL: "boots1.png",
  },
  {
    title: "Light blue Womens hiking boot",
    description: "waterproof and durable blue boot for hiking",
    category_id: 3,
    imageURL: "boots2.png",
  },
  {
    title: "Pink Columbia hiking boot",
    description: "cute fashionable boot for taking on the trails",
    category_id: 3,
    imageURL: "boots3.png",
  },
  {
    title: "The North Face Green hiking boot",
    description:
      "Durable, waterproof, and great for long trecks in the mountains",
    category_id: 3,
    imageURL: "boots4.png",
  },
  {
    title: "Brown and Coral Merrell Waterproof hiking boot",
    description: "mud resistant, warm waterproof hiking boots",
    category_id: 3,
    imageURL: "boots5.png",
  },
  {
    title: "Brown and orange Lowa hiking boot",
    description: "rubber sole, steel toed, great for working or hiking",
    category_id: 3,
    imageURL: "boots6.png",
  },
  {
    title: "Brown Comfort hiking boot",
    description: "Comfortable single-day hiking boot, build for long day hikes",
    category_id: 3,
    imageURL: "boots7.png",
  },
  {
    title: "Gray and Orange hiking boot",
    description:
      "what more to say? it's gray and orange and they go on your feet",
    category_id: 3,
    imageURL: "boots8.png",
  },
  {
    title: "Brown ankle boot",
    description:
      "built for fashion over function, this boot is good for short hikes with your rich friends",
    category_id: 3,
    imageURL: "boots9.png",
  },
  {
    title: "Black and Brown Salomon hiking boot",
    description: "classic colors, classic style, classic boot",
    category_id: 3,
    imageURL: "boots10.png",
  },
  {
    title: "Brown hiking boot",
    description:
      "this boot is brown.  You can wear them to hike!  also to camp.",
    category_id: 3,
    imageURL: "boots11.png",
  },
  {
    title: "multi-color Salewa powertex hiking boot",
    description: "Waterproof, mudproof, ultra warm hiking and camping boot.",
    category_id: 3,
    imageURL: "boots12.png",
  },
  {
    title: "Solid black Keen hiking boot",
    description:
      "all black sleek stylish hiking boot, perfect for the goth forced to take a hike.",
    category_id: 3,
    imageURL: "boots13.png",
  },
  {
    title: "Brown Hi-Tec hiking boot",
    description: "weatherproof, multi-day long treck trail boot.",
    category_id: 3,
    imageURL: "boots14.png",
  },
  {
    title: "Light brown Oboz hiking boot",
    description: "classic single day hiking boot.",
    category_id: 3,
    imageURL: "boots15.png",
  },
  {
    title: "Brown Keen hiking boot",
    description: "classic Keen hiking boot for long trails or short day hikes",
    category_id: 3,
    imageURL: "boots16.png",
  },
  {
    title: "Ocean blue La Sportiva hiking boot",
    description:
      "La Sportiva hiking, camping, or trail riding boot.  Waterproof and quick drying",
    category_id: 3,
    imageURL: "boots17.png",
  },
  {
    title: "Multi-color Keen hiking boot",
    description:
      " the classic durable and waterproof Keen boot, now in a cute multicolor design",
    category_id: 3,
    imageURL: "boots18.png",
  },
  {
    title: "MSR PocketRocket stove",
    description: "small stove to use a jetboil with",
    category_id: 4,
    imageURL: "cw1.png",
  },
  {
    title: "Green Jetboil",
    description: "small portible stove",
    category_id: 4,
    imageURL: "cw2.png",
  },
  {
    title: "Eureka Camping Stove",
    description:
      "The portable Eureka Ignite 2-burner camp stove helps you create perfectly cooked meals in the outdoors. Its 2-turn simmer control gives precise flame adjustment and enhances the cooking performance.",
    category_id: 4,
    imageURL: "cw3.png",
  },
  {
    title: "zempire High Pressure Camping Stove",
    description:
      "A complete campsite cooking solution, the Zempire 2-Burner Deluxe & Grill features 2 piezo-ignition, 10,000 BTU burners and a powerful lower grill, all of which you can use at the same time.",
    category_id: 4,
    imageURL: "cw4.png",
  },
  {
    title: "SPRK Blue Butane Camp Stove",
    description:
      "Small, portable and powerful, the Eureka SPRK+ butane camp stove boasts a powerful 11,500 BTU burner, as well as a simmer control for fine-tuned heat—all in a compact package.",
    category_id: 4,
    imageURL: "cw5.png",
  },
  {
    title: "Eureka Green Butane Camp Stove",
    description:
      "Small, portable and powerful, the Eureka SPRK+ butane camp stove boasts a powerful 11,500 BTU burner, as well as a simmer control for fine-tuned heat—all in a compact package.",
    category_id: 4,
    imageURL: "cw6.png",
  },
  {
    title: "Soto Cookset Combo",
    description:
      "Whether you're heading out on a backpacking trip or picnicking after a day hike, the Soto Amicus Stove Cookset Combo provides everything you need to cook a meal in a lightweight package.",
    category_id: 4,
    imageURL: "cw7.png",
  },
  {
    title: "Coleman Green Camp Stove",
    description:
      "Perfect for those times when trail mix just won't cut it, the Coleman Cascade Classic camp stove makes it easy to cook great meals outdoors. And its compact design makes it easy to bring along.",
    category_id: 4,
    imageURL: "cw8.png",
  },
  {
    title: "Eureka Blue Camp Stove",
    description:
      "Perfect for those times when trail mix just won't cut it, the Coleman Cascade Classic camp stove makes it easy to cook great meals outdoors. And its compact design makes it easy to bring along.",
    category_id: 4,
    imageURL: "cw9.png",
  },
  {
    title: "Eureka Orange Camp Stove",
    description: "Single burner, perfect for the single camper!",
    category_id: 4,
    imageURL: "cw10.png",
  },
  {
    title: "Jetboil Cooking System",
    description: "complete with two pans and a single burner stove",
    category_id: 4,
    imageURL: "cw11.png",
  },
  {
    title: "Army Green Coleman Camping Stove",
    description:
      "Heavy duty two burner stove, perfect for longer camping trips",
    category_id: 4,
    imageURL: "cw12.png",
  },
  {
    title: "Jetboil two burner stove",
    description: "two burners make it easier for those bigger camping groups",
    category_id: 4,
    imageURL: "cw13.png",
  },
  {
    title: "Coleman Propane Gas Cylinder",
    description:
      "compatible for all coleman stove products, and other basic camping stoves",
    category_id: 4,
    imageURL: "cw14.png",
  },
  {
    title: "Cutlery Kit",
    description:
      "comes with a cutting board, three knives, and a towel for cleaning",
    category_id: 4,
    imageURL: "cw15.png",
  },
  {
    title: "Blue Dish Set",
    description: "The Classic camping dishware set, perfect for a family of 4",
    category_id: 4,
    imageURL: "cw16.png",
  },
  {
    title: "Orange Plastic Dish Set",
    description:
      "comes with a cup, plate, bowl, fork, spoon, and knive.  Perfect for one person",
    category_id: 4,
    imageURL: "cw17.png",
  },
  {
    title: "Stanley Stainless Steel Cooking Gear",
    description: "Easy to wash and transport",
    category_id: 4,
    imageURL: "cw18.png",
  },
  {
    title: "Base Camper Ceramic Cookset",
    description:
      "When you're tasked with cooking for a group of hungry hikers, get the job done with the large GSI Outdoors Bugaboo Base Camper Ceramic Cookset. It's got the pot space for big, satisfying batches.",
    category_id: 4,
    imageURL: "cw19.png",
  },
  {
    title: "Black Single Sleeping Bag",
    description: "Classic black sleeping bag with fleece interior",
    category_id: 5,
    imageURL: "sb1.png",
  },
  {
    title: "Blue Coleman Single Sleeping Bag",
    description: "Classic blue sleeping bag with fleece interior",
    category_id: 5,
    imageURL: "sb2.png",
  },
  {
    title: "Black and Orange Two Person Sleeping Bag",
    description: "Cozy sleeping bag that sleeps two people",
    category_id: 5,
    imageURL: "sb3.png",
  },
  {
    title: "Brown Mummy Bag",
    description: "Mummy style sleeping bag, keeps you warm on cold nights",
    category_id: 5,
    imageURL: "sb4.png",
  },
  {
    title: "Brown Two Person Sleeping Bag",
    description: "Spacious enough for two people",
    category_id: 5,
    imageURL: "sb5.png",
  },
  {
    title: "Coleman Classic Brown Sleeping Bag",
    description: "Your classic sleeping bag in brown",
    category_id: 5,
    imageURL: "sb6.png",
  },
  {
    title: "The North Face Two Person Sleeping Bag",
    description: "Our classic two person sleeping bag now in Dark Blue",
    category_id: 5,
    imageURL: "sb7.png",
  },
  {
    title: "Light Brown Two Person Sleeping Bag",
    description: "cozy up in this double occupancy sleeping  bag",
    category_id: 5,
    imageURL: "sb8.png",
  },
  {
    title: "Blue 4 Person Tent",
    description: "Easy to set up 4 person tent",
    category_id: 2,
    imageURL: "tents1.png",
  },
  {
    title: "Light Brown 6 Person Tent",
    description: "easily sleeps 6 people, its basically a house.",
    category_id: 2,
    imageURL: "tents2.png",
  },
  {
    title: "Multi-Color Three Person Tent",
    description: "easy set up, sleeps three comfortably",
    category_id: 2,
    imageURL: "tents3.png",
  },
  {
    title: "Green 10 Person Tent",
    description: "Giant tent, comfortably sleeps up to 10 people.",
    category_id: 2,
    imageURL: "tents4.png",
  },
  {
    title: "Light Brown 10 Person Tent",
    description: "Giant tent, comfortably Sleeps up to 10 people.",
    category_id: 2,
    imageURL: "tents5.png",
  },
  {
    title: "Green 4 Person Tent",
    description: "Easy set up and break down, sleeps 4 adults",
    category_id: 2,
    imageURL: "tents6.png",
  },
  {
    title: "Brown 4 Person Tent",
    description: "lightweight, easy to travel with",
    category_id: 2,
    imageURL: "tents7.png",
  },
  {
    title: "Light Gray 2 Person Tent",
    description: "Lightweight, comfortably sleeps 2 people",
    category_id: 2,
    imageURL: "tents8.png",
  },
  {
    title: "Orange 6 Person Tent",
    description:
      "Extra living room/gathering space, comfortably sleeps 6 people",
    category_id: 2,
    imageURL: "tents9.png",
  },
  {
    title: "Navy Blue 6 Person Tent",
    description: "Spacious tent perfect for a weekend getaway",
    category_id: 2,
    imageURL: "tents10.png",
  },
  {
    title: "Green Pop-Up Tent",
    description:
      "Attatches to truck bed and pops up on top of the truck for easy set up and off-ground sleeping.",
    category_id: 2,
    imageURL: "tents11.png",
  },
  {
    title: "Gray and Orange 4 Person Tent",
    description: "This tent is tall so you can fully stand up inside",
    category_id: 2,
    imageURL: "tents12.png",
  },
  {
    title: "Yurt Style 10 Person Tent",
    description: "perfect for hosing any kind of cult ceremony",
    category_id: 2,
    imageURL: "tents13.png",
  },
  {
    title: "Large Green Double-Room Tent",
    description:
      "Large tent with room divider, perfect for large families.  Sleeps 6.",
    category_id: 2,
    imageURL: "tents14.png",
  },
  {
    title: "Large Blue Double-Room Tent",
    description:
      "Large tent with room divider, perfect for large families.  Sleeps 6.",
    category_id: 2,
    imageURL: "tents15.png",
  },
  {
    title: "Giant Multi-Room Tent",
    description:
      "Huge tent with room dividers, includes 4 individual rooms and big living space.  Sleeps 8 people in bedrooms, and up to 12 people total.",
    category_id: 2,
    imageURL: "tents15.png",
  },
  {
    title: "Blue Hydroflask",
    description: "22oz water bottle",
    category_id: 6,
    imageURL: "wb1.png",
  },
  {
    title: "Green Water Canteen",
    description: "16oz army green plastic canteen",
    category_id: 6,
    imageURL: "wb2.png",
  },
  {
    title: "Blue Collapsable Water Bottle",
    description: "22oz water bottle, collapsable and easy to carry",
    category_id: 6,
    imageURL: "wb3.png",
  },
  {
    title: "Gray Nalgene",
    description: "32oz water bottle",
    category_id: 6,
    imageURL: "wb4.png",
  },
  {
    title: "Light Blue Nalgene",
    description: "32oz water bottle",
    category_id: 6,
    imageURL: "wb5.png",
  },
  {
    title: "Collapsable Water Bottle",
    description: "22oz water bottle, easy to transport",
    category_id: 6,
    imageURL: "wb6.png",
  },
  {
    title: "Camping Graphics Nalgene",
    description: "32oz water bottle",
    category_id: 6,
    imageURL: "wb7.png",
  },
  {
    title: "Stainless Steel Nature Hike Bottle",
    description: "22oz water bottle and container set",
    category_id: 6,
    imageURL: "wb8.png",
  },
  {
    title: "Blue Fit Flask",
    description: "24oz water bottle, foldable",
    category_id: 6,
    imageURL: "wb9.png",
  },
  {
    title: "Wifefun Bottles",
    description: "24oz water bottles with 4 color options",
    category_id: 6,
    imageURL: "wb10.png",
  },
  {
    title: "Viaron Water Bottle",
    description: "22oz water bottle, biker friendly",
    category_id: 6,
    imageURL: "wb11.png",
  },
  {
    title: "32 oz Nalgene",
    description: "32oz Nalgene water bottle with 3 design options",
    category_id: 6,
    imageURL: "wb12.png",
  },
];

//---------------------------------------------------------INSERT ITEMS function---------------------------------------------------------
const createItem = async ({ title, description, category_id, imageURL }) => {
  try {
    const {
      rows: [item],
    } = await db.query(
      /*sql*/
      `
      INSERT INTO items(title, description, category_id, imageURL)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `,
      [title, description, category_id, imageURL]
    );
    return item;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------INSERT ITEMS function---------------------------------------------------------
const insertItems = async () => {
  try {
    for (const item of items) {
      await createItem(item);
    }
    console.log("items seeded successfully!");
  } catch (error) {
    console.error("error seeding items:", error);
  }
};

//---------------------------------------------------------REVIEWS SEED DATA---------------------------------------------------------
const reviews = [
  {
    review_text: "What an incredible item.",
    item_id: 1,
    user_id: 1,
    rating: 5,
  },
  {
    review_text:
      "Wow! This waterbottle is incredible! It holds water and everything!",
    item_id: 79,
    user_id: 6,
    rating: 5,
  },
  {
    review_text: "This propane tank is great, I use it all the time",
    item_id: 49,
    user_id: 3,
    rating: 4,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 58,
    user_id: 4,
    rating: 3,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 34,
    user_id: 1,
    rating: 2,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 11,
    user_id: 6,
    rating: 4,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 84,
    user_id: 2,
    rating: 3,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 3,
    user_id: 4,
    rating: 1,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 54,
    user_id: 5,
    rating: 5,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 77,
    user_id: 3,
    rating: 5,
  },
  {
    review_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    item_id: 1,
    user_id: 3,
    rating: 5,
  },
];

//---------------------------------------------------------CREATE REVIEW function---------------------------------------------------------
const createReview = async ({ review_text, item_id, user_id, rating }) => {
  try {
    const {
      rows: [review],
    } = await db.query(
      /*sql*/
      `
      INSERT INTO reviews(review_text, item_id, user_id, rating)
      VALUES($1, $2, $3, $4)
      RETURNING *
      `,
      [review_text, item_id, user_id, rating]
    );
    return review;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------INSERT REVIEWS function---------------------------------------------------------
const insertReviews = async () => {
  try {
    for (const review of reviews) {
      await createReview(review);
    }
    console.log("reviews seeded successfully");
  } catch (error) {
    console.error("error seeding reviews", error);
  }
};

//---------------------------------------------------------COMMENTS SEED DATA---------------------------------------------------------
const comments = [
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 5,
    review_id: 8,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 1,
    review_id: 10,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 2,
    review_id: 6,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 3,
    review_id: 7,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 4,
    review_id: 2,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 6,
    review_id: 10,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 1,
    review_id: 9,
  },
  {
    comment_text: loremIpsum({
      count: 1,
      units: "paragraphs",
      sentenceLowerBound: 5,
      sentenceUpperBound: 15,
      paragraphLowerBound: 1,
      paragraphUpperBound: 5,
    }),
    user_id: 6,
    review_id: 3,
  },
];

//---------------------------------------------------------CREATE COMMENT function---------------------------------------------------------
const createComment = async ({ comment_text, user_id, review_id }) => {
  try {
    const {
      rows: [comment],
    } = await db.query(
      /*sql*/
      `
      INSERT INTO comments(comment_text, user_id, review_id)
      VALUES($1, $2, $3)
      RETURNING *
      `,
      [comment_text, user_id, review_id]
    );
    return comment;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------INSERT COMMENTS function---------------------------------------------------------
const insertComments = async () => {
  try {
    for (const comment of comments) {
      await createComment(comment);
    }
    console.log("comments seeded successfully!");
  } catch (error) {
    console.error("error seeding comments:", error);
  }
};

//---------------------------------------------------------AGGREGATE SEED DATABASE FUNCTION---------------------------------------------------------
const seedDatabase = async () => {
  try {
    db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
    await insertCategories();
    await insertItems();
    await insertReviews();
    await insertComments();
  } catch (err) {
    throw err;
  } finally {
    db.end();
  }
};

seedDatabase();
