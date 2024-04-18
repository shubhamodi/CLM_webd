import React, { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import { GoogleSpreadsheet } from 'google-spreadsheet';

const Marketing = () => {
  const [hidden, setHidden] = useState(false);
  const [email, setEmail] = useState("")

  
  const handleHidden = () => {
    setHidden(!hidden)
  }

  const {
    private_key,
    client_email,
    sheet_id,
    spread_sheet_id
  } = process.env
  const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLE_SHEET_ID)
  const handleSubmit = async (row) => {

    try {
      await doc.useServiceAccountAuth({
      client_email: client_email,
      
      private_key:private_key,
      
      });
      
      await doc.loadInfo();
      
      console.log(doc.loadInfo());
      
      const sheet = doc.sheetsById['<YOUR_SHEET_ID>'];
      
      const result = await sheet.addRow(row);
      
      return result;
      
      } catch (e) {
      
      // console.error(“Error: “, e);
      
      }
  }

  return (
    <div 
    style={{
        background: 'radial-gradient(140% 107.13% at 50% 10%,transparent 37.41%,#0b6e4f 69.27%,#fff 100%)'
    }}

    className="bg-transparent fixed z-30 max-w-[250px] right-5 bottom-5 p-4 max-h-[200px] flex flex-col rounded-md border-[1px] border-[#0b6e4f]/50 shadow shadow-[#0b6e4f]">
     <div
     className={hidden ? 'bg-transparent z-50 rotate-180 cursor-pointer' : 'z-50 cursor-pointer'} 
     onClick={handleHidden}
     >
      {/* Open */}
      <IoMdArrowDropdown fontSize={25} />
     </div>
      {hidden
      ?
      <>
      <div className="text-base font-semibold mb-4 text-[#0b6e4f] border-b-[#0b6e4f]/20 pb-2 border-b-[1px] transition duration-900">
        Sign-Up our Newsletter
      </div>
      <div className="text-sm font-semibold">Enter your email and get the best content</div>
      <div className="justify-center items-center content-center">
        <input type="text" 
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        className="bg-[##010314 ]/50 text-black rounded-md border-[1px] mt-4 w-4/5 focus:outline-none p-1" />
        <button className="text-xs my-auto font-semibold rounded-md bg-[#0b6e4f] text-white p-1 ml-1">Send</button>
      </div>
      </>
      : null }
    </div>
  );
};

export default Marketing;
