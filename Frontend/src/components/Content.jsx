import React from 'react'
import './Component.css'

function Content() {
  return (
    <>
      <div className="sec">
        {/* First Screen (Empty or with other content) */}
        <div className="empty-screen">
          {/* You can add any content here if needed, or leave it empty */}
        </div>

        {/* Section 1 (Second Screen) */}
        <section className='sec1 w-full h-full'>
          <div className="text-white text-8xl">
            <h1>Problem Set</h1>
          </div>
        </section>

        {/* Section 2 (Third Screen) */}
        <div className="sec2 text-white text-8xl">
          <h1>Courses</h1>
        </div>

        {/* Section 3 (Fourth Screen) */}
        <div className="sec3 text-white text-8xl">
          <h1>Road-maps</h1>
        </div>
      </div>
    </>
  )
}

export default Content;
