"use client"
import "../styles/Navbar.scss"
import { Menu, Person, Search, ShoppingCart } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from "next/navigation"

const Navbar = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [query, setQuery] = useState('')

  const router = useRouter()
  const searchWork = () => {
    if (query.trim() !== "") {
      router.push(`/search/${query}`)
    }
  }

  const handleLogout = async () => {
    signOut({ callbackUrl: '/login' })
  }

  const cart = user?.cart || []

  return (
    <div className='navbar'>
      {/* Logo */}
      <a href="/">
        <img src='/assets/logo.png' alt='logo'/>
      </a>

      {/* Search Bar */}
      <div className='navbar_search'>
        <input 
          type='text' 
          placeholder='Search...' 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton disabled={!query.trim()}>
          <Search sx={{ color: "red" }} onClick={searchWork}/>
        </IconButton>
      </div>

      {/* Right Section */}
      <div className='navbar_right'>
        {user && (
          <div className='navbar_links'>
            {/* Move Admin to Left of Cart */}
            {user?.role === "admin" && (
              <Link href="/admin" className="admin">
                Admin
              </Link>
            )}
            <a href="/cart" className="cart">
              <ShoppingCart sx={{ color: "gray" }}/>
              Cart <span>({cart.length})</span>
            </a>
          </div>
        )}

        {/* Account Section */}
        <button className='navbar_right_account' onClick={() => setDropdownMenu(!dropdownMenu)}>
          <Menu sx={{ color: "gray" }} />
          {!user ? (
            <Person sx={{ color: "gray" }} />
          ) : (
            <img 
              src={user.profileImagePath} 
              alt='profile' 
              className="profile-img"
            />
          )}
        </button>

        {/* Dropdown Menu */}
        {dropdownMenu && (
          <div className='navbar_right_accountmenu'>
            {!user ? (
              <>
                <Link href="/login">Log In</Link>
                <Link href="/register">Sign Up</Link>
              </>
            ) : (
              <>
                <Link href="/wishlist">Wishlist</Link>
                <Link href="/cart">Cart</Link>
                <Link href="/order">Orders</Link>
                <Link href={`/shop?id=${user._id}`}>Your Shop</Link>
                <Link href="/create-work">Sell Your Work</Link>
                <a onClick={handleLogout}>Log Out</a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
