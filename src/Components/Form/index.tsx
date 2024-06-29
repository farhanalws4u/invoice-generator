import React, { useState, ChangeEvent } from "react";
import "./styles.css";
import { products } from "./products";

interface Address {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Item {
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalAmount: number;
  discount: number;
  taxRate: number;
  netAmount: number;
}

interface Seller {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  panNumber: string;
  gstNumber: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  billTo: Address;
  shipTo: Address;
  seller: Seller;
  items: Item[];
  subtotal: number;
  tax: number;
  total: number;
  placeOfSupply: string;
  placeOfDelivery: string;
  reverseCharge: string;
}

const InvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    date: "",
    billTo: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    seller: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      panNumber: "",
      gstNumber: "",
    },
    shipTo: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    items: [
      {
        description: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        totalAmount: 0,
        taxAmount: 0,
        netAmount: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    placeOfSupply: "",
    placeOfDelivery: "",
    reverseCharge: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | ArrayBuffer | null>(
    null
  );

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleNestedChange = (
    e: ChangeEvent<HTMLInputElement>,
    section: "billTo" | "shipTo" | "seller"
  ) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [section]: {
        ...invoiceData[section],
        [name]: value,
      },
    });
  };
  const handleItemChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    items[index] = { ...items[index], [name]: parseFloat(value) };
    setInvoiceData({ ...invoiceData, items });
  };

  const handleProductSearch = () => {
    const value = e.target.value;
    setInputValue(value);

    // Filter the products array to find matches
    const filteredSuggestions = products.filter((product) =>
      product.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: "",
          quantity: 0,
          unitPrice: 0,
          discount: 0,
          taxRate: 18,
          totalAmount: 0,
          taxAmount: 0,
          netAmount: 0,
        },
      ],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("FORM DATA======", invoiceData);

    // things to calculate--> for every item ( net amount, total amount, tax amount, tax type)
  };

  return (
    <div className="form_parent">
      <form>
        {/* INVOICE DETAILS  */}
        <div>
          <h2>Invoice Details</h2>
          <label>
            Invoice Number:
            <input
              type="text"
              name="invoiceNumber"
              value={invoiceData.invoiceNumber}
              onChange={handleChange}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={invoiceData.date}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* SELLER DETAILS  */}
        <div>
          <h2>Seller Details</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={invoiceData.billTo.name}
              onChange={(e) => handleNestedChange(e, "seller")}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={invoiceData.billTo.address}
              onChange={(e) => handleNestedChange(e, "seller")}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={invoiceData.billTo.city}
              onChange={(e) => handleNestedChange(e, "seller")}
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={invoiceData.billTo.state}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
          <label>
            Zip:
            <input
              type="text"
              name="zip"
              value={invoiceData.billTo.zip}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
        </div>

        {/* BILLING DETAILS SECTION  */}
        <div>
          <h2>Billing Address</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={invoiceData.billTo.name}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={invoiceData.billTo.address}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={invoiceData.billTo.city}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={invoiceData.billTo.state}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
          <label>
            Zip:
            <input
              type="text"
              name="zip"
              value={invoiceData.billTo.zip}
              onChange={(e) => handleNestedChange(e, "billTo")}
            />
          </label>
        </div>

        {/* SHIPPING DETAILS SECTION  */}
        <div>
          <h2>Shipping Address</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={invoiceData.shipTo.name}
              onChange={(e) => handleNestedChange(e, "shipTo")}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={invoiceData.shipTo.address}
              onChange={(e) => handleNestedChange(e, "shipTo")}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={invoiceData.shipTo.city}
              onChange={(e) => handleNestedChange(e, "shipTo")}
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="state"
              value={invoiceData.shipTo.state}
              onChange={(e) => handleNestedChange(e, "shipTo")}
            />
          </label>
          <label>
            Zip:
            <input
              type="text"
              name="zip"
              value={invoiceData.shipTo.zip}
              onChange={(e) => handleNestedChange(e, "shipTo")}
            />
          </label>
        </div>

        {/* ITEMS SECTION  */}
        <div>
          <h2>Items</h2>
          {invoiceData.items.map((item, index) => (
            <div key={index}>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
                {suggestions.length > 0 && (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </label>
              <label>
                Unit Price:
                <input
                  type="number"
                  name="unitPrice"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </label>
              <label>
                Tax Rate:
                <input
                  type="number"
                  name="taxRate"
                  value={item.taxRate}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </label>
            </div>
          ))}
          <br />
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>
        <br />
        <label>
          Place of Supply:
          <input
            type="number"
            name="placeOfSupply"
            value={invoiceData.placeOfSupply}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Place of Delivery:
          <input
            type="number"
            name="placeOfDelivery"
            value={invoiceData.placeOfDelivery}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        <label>
          Reverse Charge:
          <label>Yes</label>
          <input
            type="radio"
            name="reverseCharge"
            value={invoiceData.reverseCharge}
            onChange={handleChange}
          />
          <label>No</label>
          <input
            type="radio"
            name="reverseCharge"
            value={invoiceData.reverseCharge}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
        {/* IMAGE SECTION  */}
        <div>
          <label>Signature:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          {previewURL && (
            <img
              src={previewURL as string}
              alt="Preview"
              style={{ maxWidth: "100px", maxHeight: "50px" }}
            />
          )}
        </div>
        <br />
        <button type="submit" onClick={handleSubmit}>
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
