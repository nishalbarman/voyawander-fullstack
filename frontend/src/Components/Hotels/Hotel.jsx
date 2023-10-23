import axios from "axios";
import { useContext, useEffect, useState } from "react";
import HotelComponent from "./HotelComponent";
import styles from "./HotelComponent.module.css";
import { useSearchParams } from "react-router-dom";
import BorderBox from "../common-styles/BorderBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Hotel = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  // const {id} = useParams();

  const { isAuth, token } = useSelector((state) => state.auth);

  console.log(token);

  console.log(searchParams.get("location"));
  const navigate = useNavigate();

  const initialData = [];

  const [apiData, setApiData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [currItems, setCurrItems] = useState(0);
  const [sortOrder, setOrderBy] = useState("");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [input, setInput] = useState(searchParams.get("location") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const people = searchParams.get("people") || 1; // will give us the people, if people param is there it will provide us number or else it will give us 1

  const fetchApiData = async () => {
    console.log("I am being called");

    const server = import.meta.env.VITE_SERVER_URI;

    let url = null;
    let primaryURL = `${server}/products?category=hotel&page=${page}&limit=12`;

    if (search === "") {
      setSearchParams({ people: people });
      primaryURL = `${server}/products?category=hotel&page=${page}&limit=12`;
    } else {
      setSearchParams({ location: search, people: people });
      primaryURL = `${server}/products?category=hotel&q=${search}&page=${page}&limit=12`;
    }

    url = primaryURL;

    if (sortOrder === "default") {
      // setIsLoading(true);
      url = primaryURL;
    } else if (sortOrder === "aToZasc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=title&order=asc`;
    } else if (sortOrder === "aToZdesc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=title&order=desc`;
    } else if (sortOrder === "priceAsc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=price&order=asc`;
    } else if (sortOrder === "priceDesc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=price&order=desc`;
    } else if (sortOrder === "ratingsAsc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=rating&order=asc`;
    } else if (sortOrder === "ratingsDesc") {
      setIsLoading(true);
      url = `${primaryURL}&sort=rating&order=desc`;
    }

    console.log(url);

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });
      setCurrItems(res.data.length);
      const totalItems = res.data.total;
      console.log("total items=>", totalItems);
      const totalPagesFinal = Math.ceil(totalItems / 12);
      let pageNumbersTemp = Array.from(
        { length: totalPagesFinal },
        (_, index) => index + 1
      );
      setPageNumbers(pageNumbersTemp);
      const finalData = res.data;
      console.log("Final data=>", finalData);
      setApiData(finalData.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchApiData();
  }, [sortOrder, page]);

  useEffect(() => {
    const getData = setTimeout(() => {
      fetchApiData();
    }, 1000);

    return () => {
      clearTimeout(getData);
    };
  }, [search]);
  // const debounce = (duration) => {
  //   let timer;
  //   return (query) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {}, duration);
  //   };
  // };
  const debounceSearch = (query) => {
    setPage(1);
    setSearch(query);
  };

  const navigatePageTo = (id) => {
    navigate(`/hotelsingleinfo/:${id}`);
  };

  return (
    /*isLoading ? <h1 className={styles.loading}>Page Loading, Please Wait a Moment !</h1> : */
    <BorderBox>
      <>
        <div className={styles.filters_div}>
          <div className={styles.search}>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                debounceSearch(e.target.value);
              }}
              type="text"
              name=""
              id=""
              placeholder="Search"
            />
          </div>
          <div className={styles.sort_price}>
            <select
              name="sortingFunctionality"
              id="sortingFunctionality"
              onChange={(event) => {
                setOrderBy(event.target.value);
              }}>
              Sort By:
              <option value="default">Default</option>
              <option value="aToZasc">Sort A to Z</option>
              <option value="aToZdesc">Sort Z to A</option>
              <option value="priceAsc">Price - Low to High</option>
              <option value="priceDesc">Price - High to Low</option>
              <option value="ratingsAsc">Ratings - Low to High</option>
              <option value="ratingsDesc">Ratings - High to Low</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <h1 className={styles.no_items}>
            Page Loading, Please Wait a Moment !
          </h1>
        ) : (
          <div className={styles.allhotels}>
            {apiData?.map((hotel) => {
              return (
                <HotelComponent
                  group_size={people}
                  key={hotel.title}
                  hotel={hotel}
                />
              );
            })}
          </div>
        )}

        {currItems === 0 && isLoading === false ? (
          <h1 className={styles.no_items}>No Results Found !</h1>
        ) : (
          ""
        )}

        {!isLoading && apiData.length == 0 ? (
          <h1 className={styles.no_items}>No data found !</h1>
        ) : (
          <></>
        )}

        {isError && apiData.length === 0 ? (
          <h1 className={styles.no_items}>
            Oops !!! Error Occured While Loading the Page.
          </h1>
        ) : (
          ""
        )}
        <div className={styles.pagination}>
          {pageNumbers.map((num, index) => {
            return (
              <button
                disabled={index + 1 === page}
                style={
                  index + 1 === page
                    ? {
                        background:
                          "linear-gradient(to left, rgb(133, 199, 232), rgb(159, 226, 232))",
                      }
                    : {}
                }
                onClick={() => setPage(num)}
                key={index}>
                {num}
              </button>
            );
          })}
        </div>
      </>
    </BorderBox>
  );
};

export default Hotel;
