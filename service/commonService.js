const Product = require("../models/ProductSchema");

const validateEmail = (email) => {
  let flag = false;
  if (email) {
    if (email.includes("@") && email.includes(".com")) {
      flag = true;
    }
  } else {
    flag = false;
  }
  return flag;
};

const createSlug = async (title) => {
  let slug = "";
  try {
    slug = convertToSlug(title);
    console.log("slug : " + slug + " title : " + title);
    let product = await Product.exists({ slug: slug });
    if (product != null) {
      let newSlug = addHyphenToSlug(slug);
      slug = newSlug;
      console.log("hyphen added : ", slug);
      createSlug(slug);
    }
    return slug;
  } catch (error) {
    console.log("error : ", error);
  } finally {
  }
};

function addHyphenToSlug(slug) {
  return slug + "-";
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const numbers ='0123456789';

const generateOtp = (length) => {
    let result = ' ';
    const charactersLength = numbers.length;
    for ( let i = 0; i < length; i++ ) {
        result += numbers.charAt(Math.floor(Math.random() * charactersLength));
    }

    return  result.trim();
}

module.exports = { validateEmail, createSlug, convertToSlug , generateOtp};
