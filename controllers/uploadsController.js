const path = require('path')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const { MAX_SIZE_FILE } = process.env

const uploadProductImage  = async (req, res) => {
  // check if the file exists
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded')
  }
  // check the file type
  if (!req.files.image.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Upload only images')
  }
  // check the size
  if (req.files.image.size > MAX_SIZE_FILE) {
    throw new CustomError.BadRequestError(`Upload images smaller than ${MAX_SIZE_FILE} bytes.`)
  }

  const productImage = req.files.image;
  const imagePath = path.join(__dirname, '../public/uploads/' + productImage.name)
  await productImage.mv(imagePath)
  return res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
}

module.exports = {
  uploadProductImage
}
