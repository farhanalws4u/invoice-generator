import { useContext, useRef } from "react";
import "./styles.css";
import { invoiceContext } from "../../context/invoiceData";
import { usePDF } from "react-to-pdf";

const Invoice = () => {
  let { invoiceDataContext } = useContext(invoiceContext);
  const invoiceData = invoiceDataContext;
  console.log("INVOICE DATA FROM CONTEXT", invoiceData);

  const { toPDF, targetRef } = usePDF({ filename: "invoice.pdf" });

  return (
    <div className="parentContainer">
      <div ref={targetRef} className="container">
        {/* SECTION ONE */}
        <div className="logo_section">
          <img src={invoiceData.logo} alt="logo" className="logo" />
          <div className="logo_section_text">
            <p>Tax Invoice/Bill of Supply/Cash Memo</p>
            <span>(Original for Recipient)</span>
          </div>
        </div>

        {/* SECTION TWO */}
        <div className="soldBy_billingAddress">
          <div className="soldBy_container ellipsis-single">
            <p className="fw-800">Sold By :</p>
            <p>{invoiceData.seller.name}</p>
            <p>{invoiceData.seller.address}</p>
            <p className="soldBy_city ">
              {invoiceData.seller.city}, {invoiceData.seller.state},{" "}
              {invoiceData.seller.zip}
            </p>
            <p className="soldBy_country">IN</p>
          </div>
          <div className="billingAddress_container ellipsis-single">
            <p className="fw-800">Billing Address :</p>
            <p>{invoiceData.billTo.name}</p>
            <p>{invoiceData.billTo.address}</p>
            <p className="soldBy_city">
              {invoiceData.billTo.city}, {invoiceData.billTo.state},{" "}
              {invoiceData.billTo.zip}
            </p>
            <p className="soldBy_country">IN</p>
          </div>
        </div>

        {/* SECTION THREE */}
        <div className="panNo_shipping_container">
          <div className="panNo_container">
            <p>
              <span className="fw-800">Pan No: </span>
              {invoiceData.seller.panNumber}
            </p>
            <p>
              <span className="fw-800">GST Registration No: </span>
              {invoiceData.seller.gstNumber}
            </p>
          </div>
          <div className="shippingAddress_container ellipsis-single">
            <p className="fw-800">Shipping Address :</p>
            <p>{invoiceData.shipTo.name}</p>
            <p>{invoiceData.shipTo.address}</p>
            <p className="soldBy_city">
              {invoiceData.shipTo.city}, {invoiceData.shipTo.state},{" "}
              {invoiceData.shipTo.zip}
            </p>
            <p className="soldBy_country">IN</p>
          </div>
        </div>

        {/* SECTION FOUR */}
        <div className="order_place_container">
          <div className="orderDetails">
            <p>
              <span className="fw-800">Order Number: </span>
              {invoiceData.invoiceNumber}
            </p>
            <p>
              <span className="fw-800">Order Date: </span>
              {invoiceData.date}
            </p>
          </div>
          <div className="additionalDetails">
            <p>
              <span className="fw-800 ellipsis-single">Place of Supply: </span>
              {invoiceData.placeOfSupply}
            </p>
            <p>
              <span className="fw-800 ellipsis-single">
                Place of Delivery:{" "}
              </span>
              {invoiceData.placeOfDelivery}
            </p>
            <p>
              <p>
                <span className="fw-800">Invoice Number: </span>
                {invoiceData.invoiceNumber}
              </p>
              <p>
                <span className="fw-800">Invoice Date: </span>
                {invoiceData.date}
              </p>
            </p>
          </div>
        </div>
        {/* SECTION FIVE - Items Table */}
        <table className="itemsTable">
          <thead>
            <tr>
              <th className="w-fit-content">Sl. No</th>
              <th className="w-fit-content th_description">Description</th>
              <th className="w-fit-content">Unit Price</th>
              <th className="w-fit-content">Qty</th>
              <th className="w-fit-content">Net Amount</th>
              <th className="w-fit-content">Tax Rate</th>
              <th className="w-fit-content">Tax Type</th>
              <th className="w-fit-content">Tax Amount</th>
              <th className="w-fit-content">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.description + ""}</td>
                <td>&#8377; {item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>&#8377; {item.netAmount}</td>
                <td>{item.taxRate + "%"}</td>
                <td>{item.taxType}</td>
                <td>&#8377; {item.taxAmount}</td>
                <td>&#8377; {item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
          <tr>
            <th colSpan={7}>Sub Total</th>
            <th>{invoiceData.sumTaxAmount}</th>
            <th>{invoiceData.sumTotalAmount}</th>
          </tr>
          <tr>
            <th colSpan={7}>Grand Total</th>
            <th className="no-border-right">
              {invoiceData.sumTaxAmount + invoiceData.sumTotalAmount}
            </th>
            <th className="no-border-left"></th>
          </tr>
          <tr>
            <th colSpan={9}>
              <p className="row_amount_words">
                Amount In Words:
                {" " + invoiceData.totalInWords}
              </p>
            </th>
          </tr>
        </table>

        {/* SECTION NINE - Signature */}
        <div className="signature">
          <p>For {invoiceData.seller.name}:</p>
          <div className="signatureImagParent">
            <img
              src={invoiceData.signatureImage}
              alt="signature"
              className="signatureImage"
            />
          </div>
          <p className="authorizedSignatory">Authorized Signatory</p>
        </div>
      </div>
      <button className="downloadBtn" onClick={() => toPDF()}>
        Download Invoice
      </button>
    </div>
  );
};

export default Invoice;
