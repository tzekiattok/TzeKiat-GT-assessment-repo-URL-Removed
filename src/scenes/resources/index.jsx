import { Box, Card, CardActions, Button, IconButton, Typography, useTheme, Modal } from "@mui/material";
import { Grid as Grid2 } from "@mui/material"
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState, useMemo, useContext, useLayoutEffect } from "react";
import "./index.css";
import Pagination from "./pagination";
import Table from "./table";
import { FaTable, FaTh } from "react-icons/fa"
import { Grid } from "react-loader-spinner"
import { AccountContext } from "../accounts/Account";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Description } from "@mui/icons-material";

const Resources = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesData, setResourcesData] = useState([]);
  const [session, setSession] = useState("");
  const { getSession } = useContext(AccountContext);
  const [open, setOpen] = useState(false);
  const [viewData, setViewData] = useState();
  //Cards and Pagination 
  const [tempData, setTempData] = useState(resourcesData);
  const [isEmpty, setIsEmpty] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [defaultPageSize, setDefaultPageSize] = useState([10, 20, 50])
  //Set pagination logic
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = tempData.slice(firstPostIndex, lastPostIndex);
  //Default page view state
  const [viewCard, setViewCard] = useState(false);
  const [stateText, setStateText] = useState('<FontAwesomeIcon icon="fa-light fa-cards-blank" />');
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
  //On load get session
  useLayoutEffect(() => {
    getSession().then(session => {
      reactLocalStorage.setObject('jwt', { 'jwt': session.accessToken.jwtToken })

    });
  }, []);

  const viewTable = () => {
    if (viewCard === false) {
      setViewCard(true)
      setStateText('<FontAwesomeIcon icon="fa-light fa-table" />')
    }
    else {
      setViewCard(false)
      setStateText('<FontAwesomeIcon icon="fa-light fa-cards-blank" />')
    }
  }
  useEffect(() => { }, [viewCard, viewData])
  const columns = useMemo(
    () => [
      {
        id: "expander", // Make sure it has an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "➖" : "➕"}
          </span>
        )
      },
      {
        Header: "Items",
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
          {
            Header: "View",
            accessor: "id",
            disableSortBy: true,
            Cell: (e) => (
              <div>
                <button onClick={() => viewResource(e.row.original.id)} className="table_btn">Add to cart</button>
              </div>
            )
          }

        ],
      },
    ],
    []
  );

  //Filter search
  useEffect(() => {
    setTempData(resourcesData)
  }, [resourcesData])
  const inputStyle = {
    padding: 12,
    width: "100%",
    fontSize: "105%",

  };

  const onSearchChange = (value) => {
    const newData = resourcesData.filter(
      (resources) =>
        resources.Name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        resources.Tags.includes(value) || resources.Brand.includes(value)
    );
    setCurrentPage(1);
    setTempData(newData);
  };

  //S3 var
  const API_ENDPOINT_DYNAMODB = "#";
  //get Resources onload

  useEffect(() => {
    setIsLoading(true);
    getSession().then(session => {
      setSession(session.accessToken.jwtToken);
      reactLocalStorage.setObject('jwt', { 'jwt': session.accessToken.jwtToken })
    });
    const header = {
      'Authorization': `${reactLocalStorage.getObject('jwt').jwt}`,
      "Access-Control-Allow-Origin": "*"
    }
    fetch(
      API_ENDPOINT_DYNAMODB,
      {
        method: 'GET',
        headers: {
          //'Authorization' : `${reactLocalStorage.getObject('jwt').jwt}`,
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const resourceDatas = [];
        console.log(data.Items)
        //Sort it based on date time
        if (data.Items.length === 0) {
          setIsEmpty(true)
          setIsLoading(false);
        }
        else {
          console.log('data-items', data.Items)
          for (const key in data.Items) {
            var tagString = "";
            if (data.Items[key].Tags.length !== 0) {
              tagString = data.Items[key].Tags.join(', ');
            }
            else {
              tagString = "None"
            }
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

  //Get presigned URL
  const viewResource = async (id) => {
    //if PDF application, set header and apiendpoint
    //get resource fromm DynamoDB
    //Get resource from S3 
  }
  if (isLoading) {
    return (
      <div className="loader">
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
  const handleOpen = (data) => {
    setOpen(true)
    setViewData(data)
  }
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <div className="enableScroll">
        <Box m="20px">

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="Browse Items" subtitle="View items" />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <input
                className="search-bar"
                type="search"
                placeholder="Search Title, Tags...."
                style={inputStyle}
                onChange={(e) => onSearchChange(e.target.value)}
              >
              </input>

            </Box>
          </Box>

          {!isEmpty ? (
            <div className="r-container">
              {!viewCard ?
                <>
                  <button className="state-btn" onClick={() => viewTable()}><FaTable /></button>
                </>
                :
                <>
                  <button className="state-btn" onClick={() => viewTable()}><FaTh /></button>
                </>
              }

              {!viewCard ?
                <div className="cards">
                  {
                    currentPosts.map((resourcesData, i) => (
                      <div key={resourcesData.ItemID} >
                        <a className="product-card" >
                          <img className="product-card__image" src='https://cdn-images.farfetch-contents.com/14/82/97/77/14829777_26844957_1000.jpg' />
                          <p className="product-card__Name1">{resourcesData.Name}</p>
                          <p className="product-card__brand">{resourcesData.Brand}</p>
                          <p className="product-card__qty">Qty: {resourcesData.Quantity}</p>
                          <button className="product-card__btn-wishlist">
                            <svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M9.01163699,14.9053769 C8.72930024,14.7740736 8.41492611,14.6176996 8.07646224,14.4366167 C7.06926649,13.897753 6.06198912,13.2561336 5.12636931,12.5170512 C2.52930452,10.4655288 1.00308384,8.09476443 1.00000218,5.44184117 C0.997549066,2.99198843 2.92175104,1.01242822 5.28303025,1.01000225 C6.41066623,1.00972036 7.49184369,1.4629765 8.28270844,2.2678673 L8.99827421,2.9961237 L9.71152148,2.26559643 C10.4995294,1.45849728 11.5791258,1.0023831 12.7071151,1.00000055 L12.7060299,1.00000225 C15.0693815,0.997574983 16.9967334,2.97018759 17.0000037,5.421337 C17.0038592,8.07662382 15.4809572,10.4530151 12.8850542,12.5121483 C11.9520963,13.2521931 10.9477036,13.8951276 9.94340074,14.4354976 C9.60619585,14.6169323 9.29297309,14.7736855 9.01163699,14.9053769 Z"
                                strokeWidth="2"
                              />
                            </svg>
                          </button>
                          <button className="table_btn1" onClick={() => { handleOpen(resourcesData) }}>View more</button>
                        </a>
                      </div>
                    ))
                  }
                </div> :
                <><Table columns={columns} data={currentPosts} /></>
              }

            </div>) :
            <p className="nodata">There are no resources available at the moment.</p>
          }
          <div>
            <Pagination
              totalPosts={tempData.length}
              postsPerPage={postsPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              defaultPageSizes={defaultPageSize}
              setPostsPerPage={setPostsPerPage}
            />
          </div>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h1" component="h2">
             
            </Typography>
            <Grid2 container spacing ={2}>
              <Grid2 item md={4} >
                  <img className="product-card__image" src='https://cdn-images.farfetch-contents.com/14/82/97/77/14829777_26844957_1000.jpg' />
              </Grid2>
              <Grid2 item md={8}>
                {open === true &&
                <>
                  <p className="product-card__Name">{viewData.Name}</p>
                  <p className="product-card__brand">{viewData.Brand}</p>
                  <p className="product-card__qty">Quantity:{viewData.Quantity}</p>
                  <p className="product-card__description2">Description</p>
                  <p className="product-card__description1">{viewData.Description}</p>
                  </>
                }
              </Grid2>
            </Grid2>


          </Box>
        </Modal>
      </div>

    </>

  );

};
export default Resources;
