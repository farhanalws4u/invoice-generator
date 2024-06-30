import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { invoiceContext } from "../../context/invoiceData";
import { numberToWords } from "../../utils/conversions";

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
  taxRate: string;
  netAmount: number;
  taxType: string;
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

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  billTo: Address;
  shipTo: Address;
  seller: Seller;
  items: Item[];
  total: number;
  placeOfSupply: string;
  placeOfDelivery: string;
  reverseCharge: string;
  totalInWords: string;
  signatureImage: string;
  sumTotalAmount: number;
  sumTaxAmount: number;
  logo: string;
}

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  let { setInvoiceDataContext }: any = useContext(invoiceContext);

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
        taxRate: "18",
        totalAmount: 0,
        taxAmount: 0,
        netAmount: 0,
        taxType: "IGST",
      },
    ],
    totalInWords: "",
    total: 0,
    placeOfSupply: "",
    placeOfDelivery: "",
    reverseCharge: "",
    signatureImage: "",
    sumTotalAmount: 0,
    sumTaxAmount: 0,
    logo: "",
  });

  const [signaturePreviewURL, setSignaturePreviewURL] = useState<
    string | ArrayBuffer | null
  >(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<
    string | ArrayBuffer | null
  >(null);

  const [isCalculated, setIsCalculated] = useState(false);

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
    items[index] = { ...items[index], [name]: value };
    setInvoiceData({ ...invoiceData, items });
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
          taxRate: "18",
          totalAmount: 0,
          taxAmount: 0,
          netAmount: 0,
          taxType: "",
        },
      ],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();

      const readerForPreview = new FileReader();
      readerForPreview.onloadend = () => {
        if (e.target.name === "logo")
          setLogoPreviewUrl(readerForPreview.result);
        else setSignaturePreviewURL(readerForPreview.result);
      };
      readerForPreview.readAsDataURL(file);

      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        if (e.target.name === "logo")
          setInvoiceData({
            ...invoiceData,
            logo: url,
          });
        else
          setInvoiceData({
            ...invoiceData,
            signatureImage: url,
          });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const calculateItems = () => {
    let sumTotalAmount = 0;
    let sumTaxAmount = 0;
    const updatedItems = invoiceData.items.map((item) => {
      let netAmount;
      let totalAmount;
      let taxAmount;
      let taxType;
      let taxRate;

      netAmount = item.unitPrice * item.quantity - item.discount;
      taxAmount = netAmount * Number(item.taxRate);
      totalAmount = netAmount + taxAmount;

      if (invoiceData.placeOfDelivery === invoiceData.placeOfSupply) {
        taxType = "CGST,SGST";
        let dividedTax = Number(item.taxRate) / 2;
        taxRate = `${dividedTax}%,${dividedTax}%`;
      } else {
        taxType = "IGST";
        taxRate = item.taxRate;
      }
      sumTaxAmount += sumTaxAmount + taxAmount;
      sumTotalAmount += sumTotalAmount + totalAmount;
      return {
        ...item,
        netAmount,
        taxAmount,
        totalAmount,
        taxType,
        taxRate,
      };
    });

    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      sumTaxAmount,
      sumTotalAmount,
      totalInWords: numberToWords(sumTaxAmount + sumTotalAmount),
    });
    setIsCalculated(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setIsCalculated(false);
    calculateItems();
    console.log("FORM DATA AFTER=====", invoiceData);
  };

  useEffect(() => {
    if (isCalculated) {
      console.log("FORM DATA AFTER==d=d=", invoiceData);
      setInvoiceDataContext(invoiceData);
      // @ts-ignore
      navigate("/template");
    }
  }, [invoiceData, isCalculated]);

  return (
    <div className="invoice-form-container">
      <h1 className="top-heading">Invoice Maker</h1>
      <h2>Fill Details</h2>
      <br />
      <div className="form-parent">
        <form>
          {/* INVOICE DETAILS */}
          <div className="section">
            <h2>Invoice Details</h2>
            <br />
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

          {/* SELLER DETAILS */}
          <div className="section">
            <h2>Seller Details</h2>
            <br />
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={invoiceData.seller.name}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={invoiceData.seller.address}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={invoiceData.seller.city}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={invoiceData.seller.state}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <label>
              Zip:
              <input
                type="text"
                name="zip"
                value={invoiceData.seller.zip}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <br />
            <label>
              GST Number:
              <input
                type="text"
                name="gstNumber"
                value={invoiceData.seller.gstNumber}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
            <br />
            <label>
              PAN Number:
              <input
                type="text"
                name="panNumber"
                value={invoiceData.seller.panNumber}
                onChange={(e) => handleNestedChange(e, "seller")}
              />
            </label>
          </div>

          {/* BILLING DETAILS SECTION */}
          <div className="section">
            <h2>Billing Address</h2>
            <br />
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

          {/* SHIPPING DETAILS SECTION */}
          <div className="section">
            <h2>Shipping Address</h2>
            <br />
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

          {/* ITEMS SECTION */}
          <div className="section">
            <h2>Items</h2>
            <br />
            <div className="items_container">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="item">
                  <h4>{index + 1}:</h4>
                  <label>
                    Description:
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                    />
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
            </div>
            <button type="button" onClick={addItem}>
              Add Item
            </button>
          </div>

          {/* SUPPLY AND DELIVERY DETAILS */}
          <div className="section">
            <h2>Additional Details</h2>
            <br />
            <label>
              Place of Supply:
              <input
                type="text"
                name="placeOfSupply"
                value={invoiceData.placeOfSupply}
                onChange={handleChange}
              />
            </label>
            <label>
              Place of Delivery:
              <input
                type="text"
                name="placeOfDelivery"
                value={invoiceData.placeOfDelivery}
                onChange={handleChange}
              />
            </label>
            <div>
              <label>
                Signature Image:
                <input
                  type="file"
                  name="signatureImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {signaturePreviewURL && (
                <div className="preview-container">
                  {/* @ts-ignore  */}
                  <img src={signaturePreviewURL} alt="Signature Preview" />
                </div>
              )}
            </div>
            <div>
              <label>
                Logo Image:
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              {logoPreviewUrl && (
                <div className="preview-container">
                  {/* @ts-ignore  */}
                  <img src={logoPreviewUrl} alt="logo Preview" />
                </div>
              )}
            </div>
          </div>

          <button type="submit" onClick={handleSubmit}>
            Generate Invoice
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
