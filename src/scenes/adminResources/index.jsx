import { Box, Button, IconButton, Typography, useTheme, Modal } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useMemo, useContext, useLayoutEffect} from "react";
import "./index.css";
import axios, * as others from 'axios';
import { useEffect } from "react";
import Table from "./table";
import Pagination from "./pagination.js";
import EditModal from "./editModal";
import {Grid} from "react-loader-spinner";
import {FaFileUpload} from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../accounts/Account";
import {reactLocalStorage} from 'reactjs-localstorage';

const ResourcesAdmin = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius:'10px',
    boxShadow: 24,
    p: 4,
  };
  const styleModal = {
    border: 'none',
    borderRadius:'10px',
  }
  

  //Page variables
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [key, setKey] = useState("");
  const [session,setSession] =useState("");
  const { getSession } = useContext(AccountContext);
  //Input fields: title & tags variables
  const ENTER = 13;
  const COMMA = 188;
  const BACKSPACE = 8;
  const [tags, setTags] = useState([]);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");

  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedID, setSelectedID] = useState("");
  const [nameError, setNameError] = useState("");

  //Data table variables
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesData, setResourcesData] = useState([]);
  const [tempData, setTempData] = useState(resourcesData);
  const [isEmpty, setIsEmpty] = useState(false);
  //Pagination logic

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [defaultPageSize, setDefaultPageSize] = useState([10,20,50])
  //Set pagination logic
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = tempData.slice(firstPostIndex, lastPostIndex);
  //Modal Loading 
  const [isModalLoading, setIsModalLoading] = useState(false);

  //Add Modal variables
  const [addModalError,setAddModalError] =useState("");
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState("");

  //API endpoints
  const API_ENDPOINT_UPLOAD_RESOURCE = "#";
  const API_ENDPOINT_DELETE_RESOURCE = "#";
  const API_ENDPOINT_UPDATE_RESOURCE ="#";

  //On load get sessioan
  useLayoutEffect(()=>
        {
            getSession().then(session =>{
              reactLocalStorage.setObject('jwt', {'jwt': session.accessToken.jwtToken})
               
            });
        },[]);

  const handleDeleteModal = (e) =>{
    setOpenDelete(true);
    console.log('delete target', e.id);
    setDeleteTarget(e.id);
  }
  useEffect(()=>{},[deleteTarget])
  const handleDeleteSuccess = () =>{
    console.log('running handledelete',deleteTarget)
    handleDelete(deleteTarget);
    setOpenDelete(false);
    //window.location.reload(false);
  }
  const handleDeleteClose = () =>{
    setOpenDelete(false);
  }
  const handleOpen = () =>{ setOpen(true);  
  }
  const handleOpenSuccess =()=>{
    handleClose();
    setNameError('');
    handleCloseEdit();

    setOpenSuccess(true);
  }
  const handleCloseSuccess = () =>{ 
    setOpenSuccess(false);
    window.location.reload(false);
  }
  const handleClose = () =>{ 
    setOpen(false);
   
    setName("");
    setTags([]);
    setAddModalError("");

  }
  //Edit Modal variables
  const [openEdit, setOpenEdit] = useState(false);
  const [editItemsAttribute, setEditItemsAttributes] =useState({});
  const [editKey,setEditKey] =useState("")
  useEffect(() => {
  }, [editItemsAttribute]);

  const handleOpenEdit = (value) =>{ 
    setSelectedID(value.ItemID)
    setOpenEdit(true);
    //setTitle(value.Title);
    setName(value.Name)
    setTags(value.TagArr);
    //setKey(value.id);
    //setEditKey(value.id)

    setDescription(value.Description)
    //setPublisher('')//
    //setBrand(value.Brand)
    setQuantity(value.Quantity)
    if('Description' in value){
      setDescription(value.Description)}
    if('Brand' in value){
      setBrand(value.Brand)}
  }
  const handleCloseEdit = () =>{ 
    setOpenEdit(false);
    setAddModalError("");
    setName("");
    setTags([]);
  }
  //Input field title & tags function
  const handleName = event => setName(event.target.value)
  const handleBrand= event => setBrand(event.target.value)
  const handleQuantity= event => {
    if (event.target.value <0)
    {
      setQuantity(0)
    }
    else
    {
    setQuantity(event.target.value)}
  }
  const handleDescription= event => setDescription(event.target.value)
  const handleKey = (value) => {
    setKey(value);
  }

  //functions for tags
  const handleKeyUp = (e) => {
    const key = e.keyCode;
    if (key === ENTER || key === COMMA) {
      addTag();
    }
  };
  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    const key = e.keyCode;
    if (key === BACKSPACE && !value) {
      editTag();
    }
  };

  const addTag = () => {
    let tag = value.trim().replace(/,/g, "");
    if (!tag) return;
    setTags([...tags, tag]);
    setValue("");
  };

  const editTag = () => setValue(tags.pop());


  
  useEffect(() => {
    getSession().then(session => {
      //session data -> session.idToken.payload
      //jwt token-> session.accessToken
      setSession(session.accessToken.jwtToken);
  });
},[]);

useEffect(()=>{},[session])

  //UPLOAD FILE FUNCTIONS to S3
  const changeHandler = (event) => {
    console.log('event', event.target);
    console.log('EVENT', event.target.files[0])
  };
  //const axios = require("axios").default;


  const handleChangeStatus = ({ meta, remove }, status) => {
    console.log('status,meta,', status, meta);
  };

  //Edit existing document/ Edit resource
  const handleSubmitEdit = async () => {
    
  //End of If statement
  //Update metadata in dynamoDB
  if (name ===""){
    setNameError("Name field cannot be empty");
    return;
  }
  const headers = {
    'Content-Type': 'text/plain',
    //'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
    "Access-Control-Allow-Origin": "*"
  };
  setIsModalLoading(true);
  console.log('selectedID',selectedID)
  axios.post(API_ENDPOINT_UPDATE_RESOURCE,
    {
      ItemID: selectedID,
      Name: name,
      Tags: tags,
      Brand: brand,
      Description: description,
      Quantity: quantity.toString()
    },
    { headers }
  )
    .then(res => res.data)
    .then(data => console.log(data))
    .then(result =>{
      setIsModalLoading(false);
      console.log('opening success',result)
      handleOpenSuccess();
    });
  }


  //Key is the unique ID generated by the lambda, which will be the name of the object stored in S3
  //ADD ITEM
  const handleSubmit = async () => {
        const headers = {
          "Access-Control-Allow-Origin": "*"
        };
        if (name ===""){
          setNameError("Name field cannot be empty");
          return;
        }
        axios.post(API_ENDPOINT_UPLOAD_RESOURCE,
          {
            Name: name,
            Tags: tags,
            Brand: brand,
            Description: description,
            Quantity: quantity.toString()
          },
          { headers }
        )
          .then(res => res.data)
          .then(data => console.log(data))
          .then(result =>{
            setIsModalLoading(false);
            console.log('opening success',result)
            handleOpenSuccess();
          })
      };

  //Get all data, put in data table
  const columns = useMemo(
    () => [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "➖" : "➕"}
          </span>
        )
      },
      {
        Header: "Resource",
        // First group columns
        columns: [
          {
            Header: "ItemID",
            accessor: "ItemID",
          },
          {
            Header: "Name",
            accessor: "Name",
          },
          {
            Header: "Brand",
            accessor: "Brand"
          },
          {
            Header: "Tags",
            accessor: "Tags",
          },
          
          {
            Header: "Quantity",
            accessor: "Quantity",
          },
          {
            Header: "Description",
            accessor: "Description"
          }
        ],
      },
      {
        // Second group - Details
        Header: "Actions",
        // Second group columns
        columns: [
          /*
          {
            Header: "View",
                disableSortBy: true,
                Cell: (e) => (
                  <div>
                    <button onClick={() => viewResource(e.row.original.id)} className="viewBtn">View</button>
                  </div>
                )
          },*/
          {
            Header: "Update",
            accessor: "ItemID1",
            disableSortBy: true,
            Cell: (e ) => (
              <div>
                <button onClick={() => handleEdit(e.row.original)}  className="editBtn">Edit</button>
              </div>
            )
          },
          {
            Header: "Delete",
            accessor: "id",
            disableSortBy: true,
            Cell: (e) => (
              <div>
                <button onClick={() => handleDeleteModal(e.row.original)} className="delBtn">Delete</button>
              </div>
            )
          }

        ],
      },
    ],
    []
  );

  const handleEdit = (value) => {
    handleOpenEdit(value)
  }

  const handleDelete = (value) => {
    console.log('DELETE FUNCTION INVOKED')
    console.log('editing', value);
    const headers = {
      'Content-Type': 'text/plain',
      'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
      "Access-Control-Allow-Origin": "*"
    };
    
    console.log('delete header',headers)
    axios.post( API_ENDPOINT_DELETE_RESOURCE,
      {
        ItemID: value,
      },{
        headers
      }

    ).then(res => {
      console.log('delete response,',res.data)})
      .then(data => window.location.reload(false))
      .catch((error) => {
        if( error.response ){
            window.location.reload(false);
            console.log(error.response.data); // => the response payload 
        }
      })
  }

  const addResource =()=>{
    handleOpen();
    
  }

  const API_ENDPOINT_DYNAMODB = "https://9e4eazygid.execute-api.ap-northeast-1.amazonaws.com/deploy1/GetItems";
  const API_ENDPOINT_S3 = "https://ef8qv69yl4.execute-api.ap-northeast-1.amazonaws.com/default/getObjectFromS3viaKey";
  //GET RESOURCE onload
  useEffect(() => {
    setIsLoading(true);
    var sess ="";
    getSession().then(session => {
      setSession(session.accessToken.jwtToken);
      reactLocalStorage.setObject('jwt', {'jwt': session.accessToken.jwtToken})
  });
    const header = {'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
    "Access-Control-Allow-Origin": "*"
  }
    console.log("session api is ",header);
    fetch(
      API_ENDPOINT_DYNAMODB,
      {
      method: 'GET',
      headers:  {
        'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
        "Access-Control-Allow-Origin": "*"}
      }
    )
      .then((response) => {
        console.log('jwt response',response)
        return response.json();
      })
      .then((data) => {
        const resourceDatas = [];
        console.log('resulting data', data)
        //Sort it based on date time
        console.log('key1,', data.Items)
          if (data.Items.length === 0) {
            setIsEmpty(true);
            setIsLoading(false);
            console.log("isLoading,",isLoading);
          }
          else {
            for (const key in data.Items) {
              console.log('key,', data.Items)
              var tagString = "";
              data.Items[key]['TagArr'] =data.Items[key].Tags;
              if (data.Items[key].Tags.length !== 0) {
                tagString = data.Items[key].Tags.join(', ');
              }
              else {
                tagString = "None"
              }
              console.log('tagString', tagString);
              data.Items[key].Quantity = data.Items[key].Quantity.toString();
              data.Items[key].Tags = tagString;
   
              const rData = {
                id: data.Items[key].ItemID,
                ...data.Items[key]
              };
              resourceDatas.push(rData);
            }

            setIsLoading(false);
            setResourcesData(resourceDatas);
        }

      });

  }, []);
  //Search filter
  const onSearchChange = (value) => {
    const newData = resourcesData.filter(
      (resources) =>
        resources.Name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        resources.Tags.toLocaleLowerCase().includes(value) ||resources.ItemID.toLocaleLowerCase().includes(value) ||resources.Brand.toLocaleLowerCase().includes(value) 
    
    );
    setCurrentPage(1);
    setTempData(newData);
  };
  useEffect(() => {
    setTempData(resourcesData)
  }, [resourcesData])
  const inputStyle = {
    padding: 12,
    width: "100%",
    fontSize: "105%",
  };


  const viewResource = async (id) => {
    //if PDF application, set header and apiendpoint
    //get resource fromm DynamoDB
    //Get resource from S3 
    console.log('classID', id);
    const headers = {
      'Content-Type': 'text/plain',
      'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
      "Access-Control-Allow-Origin": "*"
      };
    axios.post(API_ENDPOINT_S3, {
      id
    },
      { headers }
    ).then(response => {
      console.log('presign URL', response.data);
      window.open(response.data,'_blank');
    })
  }

  if (isLoading) {
    return (
      <div className = "loader">
        <Grid
            height="80"
            width="80"
            color="#3c97bf"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
   
      </div>
    );
  }
  //FILE METADATA IN S3: Title, ContentType and Tags
  return (
    <>
    <div className = 'enableScroll'>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Manage Items" subtitle="Add, Update or Delete Items" />
          <Box display="flex" justifyContent="space-between" alignItems="center">
        
          <input
              className ="search-bar"
              type="search"
              placeholder="Search Title, Tags...."
              style={inputStyle}
              onChange={(e) => onSearchChange(e.target.value)}
            >
              </input>
          </Box>
        </Box>
        
          {isEmpty? <><p className ="nodata">Whoops! There are no resources available at the moment.</p>
            <p className = "message_nodata">Be the first to upload a resource</p>
            <div className = "button_center">
              <button
              className="upload_resource_logo_btn"
              onClick={() => {
                handleOpen();
              }}
            ><FaFileUpload bounce size={15}/>
              Upload Resource
            </button>
            </div>
            </>
      :
        <>
        <button
          className="upload_resource_logo_btn"
          onClick={() => {
            handleOpen();
          }}
        ><FaFileUpload bounce size={15}/>
          <label className = 'new-resource-label'>New Items</label>
        </button>
        
        <Table columns={columns} data={currentPosts} />
        <Pagination
          totalPosts={tempData.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          defaultPageSizes = {defaultPageSize}
          setPostsPerPage = {setPostsPerPage}
        />
        </>
        }
        {/*Add RESOURCES MODAL */}
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!isModalLoading ?
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h1" component="h2">
            Add new item
          </Typography>
          <label>Name*</label>
          {nameError !=="" &&
          <div>
        <label className = 'errormsg'>{nameError}</label></div>
        }
          <input
          onChange={handleName}
          className ="search-bar"
          type='text'
          value={name}
          maxLength ={50}
          placeholder="Name" />
          
        <label>Brand</label>
          <input
          onChange={handleBrand}
          className ="search-bar"
          type='text'
          value={brand}
          maxLength ={50}
          placeholder="Brand" />
        <label>Quantity</label>
          <input
          onChange={handleQuantity}
          className ="search-bar"
          type='Quantity'
          value={quantity}
          placeholder="Quantity" />

          <label>Tags</label>
        <div className="tag-c-20">
          <input
          className ="tag-input"
            type="text"
            className ="search-bar"
            maxLength ={18}
            placeholder="Press Enter to add a tag"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />

          <div className = "tag-div">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag}
              <button onClick={() => deleteTag(index)}>x</button>
            </div>
          ))}
          </div>
        </div>
        <label>Description</label>
          <textarea
          onChange={handleDescription}
          className ="search-bar"
          type='textarea'
          value={description}
          rows="5"
          maxLength ={150}
          placeholder="Description" />

        <div className = "button_center">
        <button
          className="modal_btn_update_add"
          onClick={() => {
            handleSubmit();
          }}
        >
          Upload
        </button>
        </div>
  
        </Box>:
        <div className = "loader">
        <Grid
            height="80"
            width="80"
            color="#3c97bf"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
    
      </div>

        
      }
      </Modal>
      {/*Modify RESOURCES MODAL */}
      
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!isModalLoading ?
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h1" component="h2">
            Edit resource 
          </Typography>
          <label>Name*</label>
          {nameError !=="" &&
          <div>
        <label className = 'errormsg'>{nameError}</label></div>
        }
          <input
          onChange={handleName}
          className ="search-bar"
          type='text'
          value={name}
          maxLength ={50}
          placeholder="Name" />
          
        <label>Brand</label>
          <input
          onChange={handleBrand}
          className ="search-bar"
          type='text'
          value={brand}
          maxLength ={50}
          placeholder="BXrand" />
        <label>Quantity</label>
          <input
          onChange={handleQuantity}
          className ="search-bar"
          type='number'
          value={quantity}
          placeholder="Quantity" />

          <label>Tags</label>
        <div className="tag-c-20">
          <input
          className ="tag-input"
            type="text"
            className ="search-bar"
            maxLength ={18}
            placeholder="Press Enter to add a tag"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />

          <div className = "tag-div">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag}
              <button onClick={() => deleteTag(index)}>x</button>
            </div>
          ))}
          </div>
        </div>
        <label>Description</label>
          <textarea
          onChange={handleDescription}
          className ="search-bar"
          type='textarea'
          value={description}
          rows="5"
          maxLength ={150}
          placeholder="Description" />
    
        <div className = "button_center">
        <button
          className="modal_btn_update_add"
          onClick={() => {
            handleSubmitEdit();
          }}
        >
          Update
        </button>

        </div> 
        </Box>:<div className = "loader">
        <Grid
            height="80"
            width="80"
            color="#3c97bf"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
      <p className = "modal-loading">Loading...</p>
      </div>
}
      </Modal>

      {/*Success upload of data */}
      <Modal
        open={openSuccess}
        onClose={handleCloseSuccess}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h1" component="h2">
            Resource has been successfully added!
          </Typography>
          <div className = "button_center">
          <button className = "upload_resource_logo_btn"onClick={() => {
            handleCloseSuccess();
          }}>Back to data</button>
          </div>
        </Box>
      </Modal>

      {/*Delete data modal*/}
      <Modal
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx ={{...styleModal}}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h1" component="h2">
            Confirm Delete Data?
          </Typography>
          <div className = "button_center">
          <button className = "delete_confirm_yes_btn"onClick={() => {
            handleDeleteSuccess();
          }}>Delete</button>
          <button className = "delete_confirm_yes_btn"onClick={() => {
            handleDeleteClose();
          }}>Cancel</button>
          </div>
        </Box>
      </Modal>
      
      </Box>
      </div>
    </>
    

  );

};

export default ResourcesAdmin;
