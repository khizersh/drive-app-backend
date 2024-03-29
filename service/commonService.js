const Folder = require("../models/FolderSchema");
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

const returnListOfDeletingFolder = async (folder) => {
  var finalArray = [folder._id];
  if (folder._id) {
    const folders = await Folder.find({ parentId: folder._id });
    folders.map((fold) => {
      finalArray.push(fold._id);
    });
  }
  return finalArray;
};
const deleteFromParentChildrensList = async (id , isFolder) => {
  const specificChildIds = [id];
  const parentList = await Folder.find({
    children: { $in: specificChildIds },
  });

  parentList.map(async (par) => {
    let childrenList = par.children.filter((m) => m != id);
    par.children = childrenList;
    if(isFolder){
      par.folderCount = par.folderCount - 1; 
    }else{
      par.resourcesCount = par.resourcesCount - 1;
    }
   
    await par.save();
  });
};

function addHyphenToSlug(slug) {
  return slug + "-";
}

function convertToSlug(Text) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const numbers = "0123456789";

const generateOtp = (length) => {
  let result = " ";
  const charactersLength = numbers.length;
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.trim();
};

module.exports = {
  validateEmail,
  convertToSlug,
  generateOtp,
  returnListOfDeletingFolder,
  deleteFromParentChildrensList
};
