import slugify from "slugify";
import { asyncHandler } from "../../utils/errorHandling.js";
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import subCategoryModel from "../../../DB/model/SubCategory.model.js";
import { deleteOneById , getOneById} from "../../utils/code.handler.js";
import { ApiFeatures } from "../../utils/api.features.js";
import { ErrorClass } from "../../utils/ErrorClass.js";




export const addNewSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const checkCategory = await categoryModel.findById(id);
  if (!checkCategory) {
    return next(new ErrorClass("invaild category id", 400));
  }
  const { name } = req.body;

  const checkSubCategoryName = await subCategoryModel.findOne({ name });
    if (checkSubCategoryName) {
      return next(new ErrorClass(`This Name:${name} Is Exist`,  409 ));
    }
    const slug = slugify(name)
    const {path} = req.file

    const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
          folder: `E-commerce/SubCategory/${name}`,
        });
        const subcategory = await subCategoryModel.create({
          name,
          slug,
          categoryId: id,
          image: { secure_url, public_id },
          createdBy : req.user._id
        });
        console.log(subcategory);
        return res.json({ message: "Done", subcategory });
});
//  export const addNewSubCategory = asyncHandler(async (req, res, next) => {
//   const { name, categoryId } = req.body;
//   const slug = slugify(name);
//   const { path } = req.file;

//   const checkCategory = await categoryModel.findById(categoryId);
//   if (!checkCategory) {
//     return next(new Error("Invalid Category Id", { cause: 400 }));
//   }

//   const checkSubCategoryName = await subCategoryModel.findOne({ name });
//   if (checkSubCategoryName) {
//     return next(new Error(`This Name:${name} Is Exist`, { cause: 400 }));
//   }

//   const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
//     folder: `E-commerce/SubCategory/${name}`,
//   });
//   const subcategory = await subCategoryModel.create({
//     name,
//     slug,
//     categoryId,
//     image: { secure_url, public_id },
//   });
//   console.log(subcategory);
//   return res.json({ message: "Done", subcategory });
//  });
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  req.body.name = req.body.name;
  req.body.slug = slugify(req.body.name);
  //   req.body.categoryId = req.body.categoryId
  const checkSubCategory = await subCategoryModel.findById(id);
  if (!checkSubCategory) {
    return next(new ErrorClass("Invalid SubCategory Id", 400 ));
  }

  const checkSubCategoryName = await subCategoryModel.findOne({
    name: req.body.name,
    _id: { $ne: id },
  });
  if (checkSubCategoryName) {
    return next(
      new ErrorClass(`This Name:${req.body.name} Is Exist`, 409 )
    );
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-commerce/SubCategory/${req.body.name}`,
      }
    );
    if (checkSubCategory.image.public_id) {
      await cloudinary.uploader.destroy(checkSubCategory.image.public_id);
    }
    req.body.image = { secure_url, public_id };
  }

  console.log(req.body);
  const subcategory = await subCategoryModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  return res.json({ message: "Done", subcategory });
});
export const deleteSubCategory = deleteOneById(subCategoryModel)

export const getAllSubCategoies = asyncHandler(async(req,res,next)=>{

  const apiFeatures = new ApiFeatures(subCategoryModel.find({}).populate([{
    path:"Products"
  }]),req.query).pagination().filter().sort().search().select()

  const AllSubCategoies = await apiFeatures.mongooseQuery

  return res.status(200).json({message:"Done", AllSubCategoies})
})
export const getSubCategoryById = getOneById(subCategoryModel)








// export const searchSubCategory = asyncHandler(async (req, res, next) => {
//   const { keyWord } = req.query;
//   console.log(keyWord);
//   const subCategory = await subCategoryModel.find({name:{$regex:`${keyWord}`}});
//   return res.status(200).json({ message: "Done",subCategory });
// });