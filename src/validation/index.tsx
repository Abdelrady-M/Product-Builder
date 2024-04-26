




export const productValidation = (product:{ 
    title: string;
    description: string;
    imageURL: string;
    price: string;
})=>{
    //** Return an object  
const errors: {
    title: string;
    description: string;
    imageURL: string;
    price: string;
    } =
    {
        title: "",
        description: "",
        imageURL: "",
        price: "",
    }

const validUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(product.imageURL);


if (!product.title.trim() || product.title.length < 10 || product.title.length > 80){
    errors.title = "Title must be between 10 and 80 characters"
}
if (!product.description.trim() || product.description.length < 10 || product.description.length > 900){
    errors.description = "Description must be between 10 and 900 characters"
}
if (!product.imageURL.trim() || !validUrl){
    errors.imageURL = "Please enter a valid image URL"
}

if (!product.price.trim() || isNaN(Number(product.price))){
    errors.price = "Please enter a valid price"
}
    return errors
}