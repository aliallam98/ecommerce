import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'





export const addNewSubCategory ={
    body:joi.object().required().keys(
        {name:generalFields.name}
    ),
    file:generalFields.file.required(),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(),
}
export const updateSubCategory ={
    body:joi.object().required().keys(
        {name:generalFields.name}
    ),
    file:generalFields.file,
    params:joi.object().required().keys(
        {id : generalFields.id}
    ),
    query:joi.object().required().keys(),
}
export const deleteSubCategory ={
    body:joi.object().required().keys(),
    file:joi.object().keys(),
    params:joi.object().required().keys(
        {id : generalFields.id}
    ),
    query:joi.object().required().keys(),
}
export const searchSubCategory ={
    body:joi.object().required().keys(),
    file:joi.object().keys(),
    params:joi.object().required().keys(),
    query:joi.object().required().keys(
        {keyWord:generalFields.name}
    ),
}
export const getSubCategoryById ={
    body:joi.object().required().keys(),
    file:joi.object().keys(),
    params:joi.object().required().keys(
        {id : generalFields.id}
    ),
    query:joi.object().required().keys(),
}