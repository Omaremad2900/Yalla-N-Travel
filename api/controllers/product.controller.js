import { StatusCodes } from "http-status-codes";

export const getAllProducts = async (req, res, next) => {
  try {
    const productService = await req.container.resolve('productService');
    const productStatus = req.headers['product-status'] || 'all';
    // get page and limit from query
    const { page, limit } = req.query;
    let products;
    if(req.user.role == 'Tourist'){
      products = await productService.getAllUnArchivedProducts(page,limit);
    }
    else{
      products = productStatus === 'archived' ? await productService.getAllArchivedProducts(page,limit) :
      productStatus === 'unarchived' ? await productService.getAllUnArchivedProducts(page,limit):
      await productService.getAllProducts(page,limit,req.user.role);
  }
  res.status(StatusCodes.OK).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};


export const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productService = await req.container.resolve('productService');
    const product = await productService.getProductById(productId);
    res.status(StatusCodes.OK).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {

    const { name, description, price, imageUrl,availableQuantity } = req.body;

    const { role, id } = req.user;

    const productService = await req.container.resolve('productService');
    const newProduct = await productService.createProduct({
      name, description, price, availableQuantity, imageUrl, seller: id
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: { product: newProduct } });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.role === "Seller" ? req.user.id : req.body.seller;
    const { name, description, price, availableQuantity, imageUrl } = req.body;

    const productService = await req.container.resolve('productService');
    const updatedProduct = await productService.editProduct(
      productId, { name, description, price, availableQuantity, imageUrl, seller: sellerId }
    );

    res.status(StatusCodes.OK).json({ success: true, data: { product: updatedProduct } });
  } catch (error) {
    next(error);
  }
};

export const getProductsSortedByRating = async (req, res, next) => {
  try {
    const { order = "desc" } = req.query;
    const productService = await req.container.resolve('productService');
    const products = await productService.sortByRatings(order);
    res.status(StatusCodes.OK).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new apiError("Product name is required", StatusCodes.BAD_REQUEST));
  }

  try {
    const productService = await req.container.resolve('productService');
    const products = await productService.searchProductsByName(name);
    res.status(StatusCodes.OK).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const filterProducts = async (req, res, next) => {
  const { minPrice, maxPrice } = req.query;
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;

  try {
    const productService = await req.container.resolve('productService');
    const products = await productService.filterProductsByPrice(min, max);
    res.status(StatusCodes.OK).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

export const archiveProduct = async (req,res,next) =>{
  try {
    const {productId} = req.params;
    const productService = await req.container.resolve('productService');
    productService.archiveProduct(productId);
    res.status(StatusCodes.OK).json({ success: true,productId});
    
  } catch (error) {
    next(error);   
  } 
};

export const unArchiveProduct = async (req,res,next) =>{
  try {
    const { productId } = req.params;
    const productService = await req.container.resolve('productService');
    productService.unArchiveProduct(productId);
    res.status(StatusCodes.OK).json({ success: true,productId});
    
  } catch (error) {
    next(error);   
  } 
};

  export const addReview = async (req,res,next) =>{
    try {
      const reviewService = await req.container.resolve('reviewService');
      const touristService = await req.container.resolve("touristService");
      const tourist = await touristService.findTouristByUserId(req.user.id);
      const newAvgRating=await reviewService.createReview("Product" ,req.params.productId,tourist._id,req.body.rating,req.body.comment);

      res.status(StatusCodes.OK).json({ success: true,newAvgRating});      
    } catch (error) {
      next(error);   

    }
  }

  export const getReviews = async (req,res,next) =>{
    try {
      const reviewService = await req.container.resolve('reviewService');
      const touristService = await req.container.resolve("touristService");
      const tourist = await touristService.findTouristByUserId(req.user.id);
      const reviews= await reviewService.getAllUserReviews("Product" ,tourist._id);
      res.status(StatusCodes.OK).json({ success: true,data:reviews});      
    } catch (error) {
      next(error);   

    }
  }
  // get all reviews
  export const getAllReviews = async (req,res,next) =>{
    try {
      const reviewService = await req.container.resolve('reviewService');
      const reviews= await reviewService.getAllReviews("Product" ,req.params.productId)
      res.status(StatusCodes.OK).json({ success: true,data:reviews});      
    } catch (error) {
      next(error);   

    }
  }

 