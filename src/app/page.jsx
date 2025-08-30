'use client'

import Navbar from './components/Navbar';
import Herocomp from './components/Herocomp';


export default function Page() {

  return (
    <div className='max-w-[1300px] m-auto'>
        <Navbar />
        <Herocomp />
    </div>
  );
}
