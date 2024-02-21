import React, { useState, useEffect } from "react";

export function Products() {
    const [content, setContent] = useState(<ProductList showForm={showForm}/>);

    function showList() {
        setContent(<ProductList showForm={showForm}/>)
    }

    function showForm(product) {
        setContent(<ProductForm product={product} showList={showList}/>)
    }

    return (
        <div  className="container my-5">
            {content}
        </div>
    );
}

function ProductList(props) {
    const [products, setProducts] = useState([]);

    function fetchProducts() {
        fetch("http://localhost:3004/products")
        .then((response) => {
            if (!response.ok) {
                throw new Error("unexpected server response");
            }
            return response.json();
        })
        .then((data) =>  {
            setProducts(data);
        })
        .catch((error) => console.log("error: ", error));
    }

    useEffect(() => fetchProducts(), []);

    function deleteProduct(id) {
        fetch("http://localhost:3004/products/" + id, {
            method: 'DELETE'
        })
        // .then((response) => response.json())
        .then((data) => fetchProducts());
    }

    return (
        <>
        <h2 className="text-center mb-3">List of Products</h2>
        <button type="button" onClick={() => props.showForm({})} className="btn btn-primary me-2">Create</button>
        <button type="button" onClick={() => fetchProducts()} className="btn btn-outline-primary me-2">Refresh</button>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map((product, index) => {
                        return (
                            <tr key={index}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.createdAt}</td>
                                <td style={{width:"10px", whiteSpace: "nowrap"}}>
                                    <button onClick={() => props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        )
                    }) 
                }
            </tbody>
        </table>
        </>
    );
}

function ProductForm(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        // read form data
        const formData = new FormData(event.target);

        // convert form data to object
        const product = Object.fromEntries(formData.entries());

        // form validation
        if (!product.name || !product.brand || !product.category || !product.price) {
            console.log("Please provide all the required fields!");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                    Please provide all the required fields!
                </div>
            )
            return;
        }

        if (props.product.id) {
            // update the product
            fetch("http://localhost:3004/products/" + props.product.id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
            .then((response) => {
                if(!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.error("Error:", error);
            });

        } else {
            // create a new product
            product.createdAt = new Date().toISOString().slice(0, 10);
            fetch("http://localhost:3004/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })
            .then((response) => {
                if(!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    return (
        <>
        <h2 className="text-center mb-3">{props.product.id ? "Edit Product" : "Create New Product"}</h2>

        <div className="row">
            <div className="col-lg-6 mx-auto">

            {errorMessage}

            <form onSubmit={(event) => handleSubmit(event)}>
                {props.product.id && <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">ID</label>
                    <div className="col-sm-8">
                        <input readOnly className="form-control-plaintext"
                            name="name"
                            defaultValue={props.product.id} />
                    </div>
                </div>}

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                        <input className="form-control"
                            name="name"
                            defaultValue={props.product.name} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Brand</label>
                    <div className="col-sm-8">
                        <input className="form-control"
                            name="brand"
                            defaultValue={props.product.brand} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Category</label>
                    <div className="col-sm-8">
                        <select className="form-select"
                            name="category"
                            defaultValue={props.product.category}>
                            
                            <option value='Other'>Other</option>
                            <option value='Phones'>Phones</option>
                            <option value='Computers'>Computers</option>
                            <option value='Accessories'>Accessories</option>
                            <option value='GPS'>GPS</option>
                            <option value='Cameras'>Cameras</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Price</label>
                    <div className="col-sm-8">
                        <input className="form-control"
                            name="price"
                            defaultValue={props.product.price} />
                    </div>
                </div>

                <div className="row mb-3">
                    <label className="col-sm-4 col-form-label">Description</label>
                    <div className="col-sm-8">
                        <textarea className="form-control"
                            name="description"
                            defaultValue={props.product.description} />
                    </div>
                </div>

                <div className="row">
                    <div className="offset-sm-4 col-sm-4 d-grid">
                        <button type="submit" className="btn btn-primary btn-sm me-3">Save</button>
                    </div>
                    <div className="col-sm-4 d-grid">
                        <button type="button" onClick={() => props.showList()} className="btn btn-secondary me-2">Cancel</button>
                    </div>
                </div>
            </form>
            </div>
        </div>
        </>
    );
}