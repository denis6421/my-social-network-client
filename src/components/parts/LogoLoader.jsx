import React, { Component } from 'react'
    import Logo from '../../images/logo.svg'
const LogoLoader  =() => {
    return (
        <div className='logo__loader'>
            <img src={Logo} alt=""/>
        </div>
    )
}
export default LogoLoader