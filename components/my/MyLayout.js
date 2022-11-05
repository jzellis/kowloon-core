import Navbar from "./Navbar"

export default function MyLayout({ children }) {
    return (
      <>
        <div className="container mx-auto">
        <Navbar />
        <main>{children}</main>
        </div>
      </>
    )
  }