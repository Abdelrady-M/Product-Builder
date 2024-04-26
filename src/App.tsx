import { ChangeEvent, FormEvent, useState } from "react"
import ProductCard from "./components/ProductCard"
import Modal from "./components/ui/Model"
import { categories, colors, formInputsList, productList } from "./data"
import Button from "./components/ui/Button"
import Input from "./components/ui/Input"
import { IProduct } from "./interfaces"
import { productValidation } from "./validation"
import ErrorMessage from "./components/ErrorMessage"

import CircleColor from "./components/CircleColor"
import { v4 as uuid } from "uuid";
import Select from "./components/ui/Select"
import { ProductNameTypes } from "./types"
import toast , {Toaster} from "react-hot-toast"

const App = () => {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };
  /* ------- STATE -------  */
  const [products, setProducts] = useState<IProduct[]>(productList)
  const [product, setProduct] = useState<IProduct>(defaultProductObj)
  const [productToEdit, setProductToEdit] = useState<IProduct>(defaultProductObj)
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0)
  const [errors, setErrors] = useState({ title: "", description: "", imageURL: "", price: "" })
  const [tempColors, setTempColor] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenEditModel, setIsOpenEditModel] = useState(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(categories[0])

  /* ------- HANDLER -------  */

  const closeModal = ()=> setIsOpen(false)
  const openModal = ()=>setIsOpen(true)
  const closeEditModal = ()=> setIsOpenEditModel(false)
  const openEditModal = ()=>setIsOpenEditModel(true)
  const closeConfirmModal = () => setIsOpenConfirmModal(false);
  const openConfirmModal = () => setIsOpenConfirmModal(true);



  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = event.target
    setProduct({...product, [name]:value})
    setErrors({...errors, [name]:""})
  }
  const onChangeEditHandler = (event: ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = event.target
    setProductToEdit({...productToEdit, [name]:value})
    setErrors({...errors, [name]:""})
  }


  const onCancel = ()=>{
    setProduct(defaultProductObj)
    closeModal()
    closeEditModal();
  }

  const removeProductHandler = () => {
    const filtered = products.filter(product => product.id !== productToEdit.id);
    setProducts(filtered);
    closeConfirmModal();
    toast("Product has been deleted successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "#c2344d",
        color: "white",
      },
    });
  };



  const submitHandler = (event: FormEvent<HTMLFormElement>):void=>{
    event.preventDefault()
    const {title, description, price, imageURL}= product
    const errors = productValidation({     
      title,
      description,
      price,
      imageURL
    })
    const hasErrorMsg = Object.values(errors).some(value => value === '' ) && Object.values(errors).every(value => value === '')

    if(!hasErrorMsg){
      setErrors(errors)
      return
    }
    
    setProducts(prev => [...prev, {...product, id:uuid(), colors:tempColors, category:selectedCategory}])
    setProduct(defaultProductObj)
    setTempColor([])
    closeModal()
    toast("Product has been Added successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "green",
        color: "black",
      },
    });
  }
  const submitEditHandler = (event: FormEvent<HTMLFormElement>):void=>{
    event.preventDefault()
    const {title, description, price, imageURL}= productToEdit
    const errors = productValidation({     
      title,
      description,
      price,
      imageURL
    })
    const hasErrorMsg = Object.values(errors).some(value => value === '' ) && Object.values(errors).every(value => value === '')

    if(!hasErrorMsg){
      setErrors(errors)
      return
    }
    
  
    // setProducts(prev => prev.map((product, idx) => idx === productToEditIdx? {...productToEdit, id:uuid(), colors:tempColors, category:selectedCategory} : product))

    const updateProducts = [...products]
    updateProducts[productToEditIdx] = {...productToEdit , colors:tempColors.concat(productToEdit.colors)}

    setProducts(updateProducts)
    setProductToEdit(defaultProductObj)
    setTempColor([])
    closeEditModal()
    toast("Product has been Edit successfully!", {
      icon: "👏",
      style: {
        backgroundColor: "green",
        color: "white",
      },
    });
  }



  const renderProductList = products.map((product, idx) => <ProductCard key={product.id} product={product} setProductToEdit={setProductToEdit} openEditModal={openEditModal} setProductToEditIdx={setProductToEditIdx} idx={idx} openConfirmModel={openConfirmModal}/> )
  const renderFormInputList = formInputsList.map(input => ( 
    <div className="flex flex-col" key={input.id}>
      <label htmlFor={input.id} className="mb-[2px] text-sm font-medium text-gray-700">{input.label}</label>
      <Input type="text" id={input.id} value={product[input.name]} name={input.name} onChange={onChangeHandler}/>
      <ErrorMessage msg={errors[input.name]}/>
    </div>
  ))

  const renderProductColors = colors.map(color => (
    <CircleColor
      key={color}
     color={color}
     onClick={()=>{
      if(tempColors.includes(color)){
        setTempColor(prev => prev.filter(item => item !== color))
        return
      }
      if(productToEdit.colors.includes(color)){
        setTempColor(prev => prev.filter(item => item !== color))
        return
      }
       setTempColor(prev=> [...prev, color]) 
     }}
  />
))

const renderProductEditWithErrorMsg = (id:string, label:string, name:ProductNameTypes ) =>{
  return (
    <div className="flex flex-col" >
    <label htmlFor={id} className="mb-[2px] text-sm font-medium text-gray-700">{label}</label>
    <Input type="text" id={id} value={productToEdit[name]} name={name} onChange={onChangeEditHandler}/>
    <ErrorMessage msg={errors[name]}/>
  </div>
  )
}

  return (

    /* ------- RENDER -------  */
   <main className="container mx-auto">
    <Button
        className="block bg-indigo-700 hover:bg-indigo-800 mx-auto my-10 px-10 font-medium"
        onClick={openModal}
        width="w-fit"
      >
        Build a Product
      </Button>
     <div className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
      {renderProductList}
    </div >
       {/* ADD PRODUCT MODEL */}
       <Modal isOpen={isOpen} closeModal={closeModal} title="ADD A NEW PRODUCT">
      <form className="space-y-3" onSubmit={submitHandler}>
          {renderFormInputList}
          <Select selected={selectedCategory} setSelected={setSelectedCategory}/>
          <div className="flex items-center flex-wrap space-x-1">{renderProductColors}</div>
          <div className="flex items-center flex-wrap space-x-1">
          {
              tempColors.map(color => <span key={color} className="p-1 mr-2 mb-1 text-xs rounded-md text-white" style={{backgroundColor: color}}>{color}</span>)
          }
          </div>
        
        <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">Submit</Button>
            <Button type="button" className="bg-[#f5f5fa] hover:bg-gray-500 !text-black" onClick={onCancel}>
                      Cancel
            </Button>
        </div>
      </form>
    </Modal>
    {/* EDIT PRODUCT MODEL */}
    <Modal isOpen={isOpenEditModel} closeModal={closeEditModal} title="EDIT THIS PRODUCT">
      <form className="space-y-3" onSubmit={submitEditHandler}>
      {renderProductEditWithErrorMsg('title', "Product Title", "title")}
      {renderProductEditWithErrorMsg('description', "Product description", "description")}
      {renderProductEditWithErrorMsg('imageURL', "Product image URL", "imageURL")}
      {renderProductEditWithErrorMsg('price', "Product price", "price")}

          {/* {renderFormInputList} */}
          <Select selected={productToEdit.category} setSelected= {(value)=> setProductToEdit({...productToEdit, category:value})}/>
          <div className="flex items-center flex-wrap space-x-1">{renderProductColors}</div>
          <div className="flex items-center flex-wrap space-x-1">
          {
              tempColors.concat(productToEdit.colors).map(color => <span key={color} className="p-1 mr-2 mb-1 text-xs rounded-md text-white" style={{backgroundColor: color}}>{color}</span>)
          }
          </div>
        
        <div className="flex items-center space-x-3">
            <Button className="bg-indigo-700 hover:bg-indigo-800">Submit</Button>
            <Button type="button" className="bg-[#f5f5fa] hover:bg-gray-500 !text-black" onClick={onCancel}>
                      Cancel
            </Button>
        </div>
      </form>
    </Modal>

        {/* DELETE PRODUCT CONFIRM MODAL */}
        <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button className="bg-[#c2344d] hover:bg-red-800" onClick={removeProductHandler}>
            Yes, remove
          </Button>
          <Button type="button" className="bg-[#f5f5fa] hover:bg-gray-300 !text-black" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Toaster />
   </main>
   )
}

export default App
