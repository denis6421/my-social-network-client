import React, { useState, useEffect, useRef } from "react";
import { apiPostRequest } from "../../api/api";
import { USER_PAGE_ROUTE } from "../../tools/routes";
import { Link } from "react-router-dom";
import UserAvatar from "../parts/UserAvatar";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import useOnClickOutside from "use-onclickoutside";

const NavbarSearch = ({show_component, setShowSearch}) => {
  const [time_out, handleTimeout] = useState(false);
  const [search_key, setSearchKey] = useState("");
  const [active, setActive] = useState(false);
  const [results, setResults] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, active ? () => setActive(false) : "");

  const handleSearch = (key) => {
    window.clearTimeout(time_out);
    const api = "user/search";
    setSearchKey(key);
    const timeout = setTimeout(async () => {
      const body = {
        key,
      };
      const res = await apiPostRequest(api, body);
      if (res.ok) {
        setResults(res.result);
        setActive(true);
      }
    }, 300);
    handleTimeout(timeout);
  };

  const reset = () => {
    
    setSearchKey("");
    setResults([]);
    setActive(false);
    setShowSearch()
  };

  return (
    <div
    id={show_component ? 'navbar__search--active' : ''}
    ref={ref} className="navbar__search">
      <section 

      className='overlay'
        onClick ={() => setShowSearch()}
      ></section>
     
      <div className='navbar__search__input'> 
      <input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        placeholder="Search..."
        onFocus={() => setActive(true)}
        value={search_key}
      />
       <SearchOutlinedIcon className="navbar__search__icon" />
      </div>
      {results && results.length > 0 ? (
        <section
        style ={{
          position:'relative',
          width:'100%'
        }}
        >
          <aside
          style ={{
            opacity:active ? 1  :0,
            transition:'0.2s all'
          }}
          className="arrow-up"></aside>
          <ul
          id={active ? "navbar__search__results--active" : ""}
          className="navbar__search__results"
        >
          
          {results.map((result, i) => {
            return (
              <li key={i}>
                <Link
                  onClick={() => reset()}
                  className="flex__start"
                  to={USER_PAGE_ROUTE.replace(":id", result.username)}
                >
                  <UserAvatar img={result.avatar} />
                  <p className="text__overflow">{result.username}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        </section>
      ) : (
        ""
      )}
    </div>
  );
};

export default NavbarSearch;
