import React, { useRef, useState, useEffect } from 'react';
import s from './Edit.module.css';
import Vector from '../../assets/Vector.svg'
import { Link } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';



function Edit(props) {
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');

  //variables for country
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 25; // Количество элементов, которые необходимо загрузить при каждом запросе
  const [searchQueryCountry, setSearchQueryCountry] = useState(''); // Input value for country search
  const [selectedCountry, setSelectedCountry] = useState([]);

  const navigate = useNavigate()
  const location = useLocation();


  // Getting access_token and refresh_token from URL
  const { order_id } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState(searchParams.get('access_token'));
  const [refreshToken, setRefreshToken] = useState(searchParams.get('refresh_token'));
  const [telegram_id, setTelegram_id] = useState(searchParams.get('telegram_id'));

  //variables for skills
  const [isOpenCountryForm, setIsOpenCountryForm] = useState(false);
  const [skills, setSkills] = useState([]);
  const [scrollbarHeight1__1, setScrollbarHeight1__1] = useState(0);
  const [isOpenSkillsForm, setIsOpenSkillsForm] = useState(false);
  const [searchQuerySkills, setSearchQuerySkills] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkillsId, setSelectedSkillsId] = useState([]);
  const limit__1 = 25;
  const [offset__1, setOffset__1] = useState(0);
  const dropdownRef1__1 = useRef(null);
  const scrollContainerRef1__1 = useRef(null);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  //variables for city
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([])
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingCity, setLoadingCity] = useState(false);
  const [offsetCity, setOffsetCity] = useState(0);
  const limitCity = 25; // Количество элементов, которые необходимо загрузить при каждом запросе
  const [searchQueryCity, setSearchQueryCity] = useState(''); // Input value for country search
  const dropdownRef2 = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const scrollbarRef2 = useRef(null);
  const [scrollbarHeight2, setScrollbarHeight2] = useState(0);

  useEffect(()=>{
    setAccessToken(sessionStorage.getItem('accessToken') !== null ? sessionStorage.getItem('accessToken') : searchParams.get('access_token'))
    setRefreshToken(sessionStorage.getItem('refreshToken') !== null ? sessionStorage.getItem('refreshToken') : searchParams.get('refresh_token'))
  },[])
  
//errors
  const [errorFields, setErrorFields] = useState({
    selectedCity: false,
    selectedCountry: false,
    selectedSkills: false,
    phone: false,
    title: false,
    price: false,
    term: false
  });

  const validateFields = () => {
    const errors = {
      selectedCity: selectedCity === '',
      selectedCountry: selectedCountry === '',
      selectedSkills: selectedSkills.length === 0,
      phone: phone === '',
      title: title === '',
      price: price === '',
      term: term === ''
    };
    setErrorFields(errors);
    return !Object.values(errors).some(Boolean);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenCountryForm(false);
      }
    };
    const handleClickOutside2 = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsOpen2(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    document.addEventListener('mousedown', handleClickOutside2);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside2);

    };
  }, []);

  useEffect(() => {
    const calculateScrollbarHeight = () => {
      const scrollContainerHeight = scrollContainerRef.current.offsetHeight;
      const contentHeight = scrollContainerRef.current.scrollHeight;
      const scrollbarHeightPercentage = (scrollContainerHeight / contentHeight) * 100;
      setScrollbarHeight(scrollbarHeightPercentage);
    };

    calculateScrollbarHeight();

    const handleResize = () => {
      calculateScrollbarHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpenCountryForm(!isOpenCountryForm);
    fetchCities()
  };
  const toggleDropdown2 = () => {
    setIsOpen2(!isOpen2);
  };

 const selectCountry = (country) => {
    setSelectedCountry(country);
    fetchCities()
    setSearchQueryCountry(country[0]); // Update searchQuery with selected country label
    setIsOpenCountryForm(false);
  };
 const selectCity = (country) => {
    setSelectedCity(country);
    setSearchQueryCity(country[0]); // Update searchQuery with selected country label

    setIsOpen2(false);
  };



  const fetchCountries = async () => {
    if (loading) return;



    setLoading(true);

    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country?startswith=${searchQueryCountry}&offset=${offset}&limit=${limit}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setCountries(prevCountries => [...prevCountries, ...newCountries]); // Добавляем загруженные страны к списку
      setOffset(prevOffset => prevOffset + limit); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }

    setLoading(false);
  };
  const fetchCities = async () => {
    if (loadingCity) return;

  if (selectedCountry[1] === '' || selectedCountry[1] === undefined) {
      return;
    }

    setLoadingCity(true);

    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country/cities?country_id=${selectedCountry[1]}&startswith=${searchQueryCity}&offset=${offsetCity}&limit=${limitCity}`);
      const data = await response.json();
      const newCities = data.items.map(([citys, id]) => ({ label: citys, value: id }));

      setCities(prevCountries => [...prevCountries, ...newCities]); // Добавляем загруженные страны к списку
      setOffsetCity(prevOffset => prevOffset + limitCity); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }finally {
      setLoadingCity(false);
    }

    
  };

useEffect(() => {
  setOffset(0); // Reset offset to 0 when searchQuery changes
  setCountries([]); // Reset countries list to empty when searchQuery changes
}, [searchQueryCountry]);
useEffect(() => {
  setOffsetCity(0); // Reset offset to 0 when searchQuery changes
  setCities([]); // Reset countries list to empty when searchQuery changes
}, [searchQueryCity]);


  useEffect(() => {
        setSelectedCity(sessionStorage.getItem('selectedCity') !== null && sessionStorage.getItem('selectedCity'))
        setSelectedCountry(sessionStorage.getItem('selectedCountry') !== null && sessionStorage.getItem('selectedCountry'))
      }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight(scrollbarHeightPercentage);
    scrollbarRef.current.style.height = `${(scrollbarHeightPercentage)-13}%`;
    scrollbarRef.current.style.top = `${(scrollTop / scrollHeight) * 100}%`;
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loading) {
        setLoading(true);

      
        fetchCountries(); // Загружаем следующую порцию стран при достижении конца прокрутки
        setLoading(false);
      }
    }
  };

    const handleScroll2 =  (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const scrollbarHeightPercentage2 = (clientHeight / scrollHeight) * 100;
      setScrollbarHeight2(scrollbarHeightPercentage2);
      const maxTopPosition = 100 - scrollbarHeightPercentage2;
      scrollbarRef2.current.style.height = `${scrollbarHeightPercentage2-13}%`;
      scrollbarRef2.current.style.top = `${(scrollTop / scrollHeight) * 100}%`;
  
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loadingCity) {
        setLoadingCity(true);

        fetchCities(); // Загружаем следующую порцию стран при достижении конца прокрутки
        setLoadingCity(false);

      }
    }
  };
  
useEffect(() => {
   if (searchQueryCountry !== ''){
      fetchCountries(); // Call fetchCountries whenever searchQuery changes
  }
}, [searchQueryCountry]);

useEffect(() => {
  if (searchQueryCountry !== ''){
     fetchCities(); // Call fetchCountries whenever searchQuery changes
  }
}, [searchQueryCity]);

const handleInputChange = (e) => {
  const newSearchQuery =e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);;
  setSearchQueryCountry(newSearchQuery);
  setOffset(0); // Reset offset to 0 whenever searchQuery changes
};

const handleInputChange2 = (e) => {
  const newSearchQuery = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);;
  setSearchQueryCity(newSearchQuery);
  setOffsetCity(0);
};



   const [price, setPrice] = useState(0)
   const [term, setTerm] = useState('')
   const [termScale, setTermScale] = useState(0)


    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };
    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };
    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };
    const handleChangeTerm = (event) => {
        setTerm(event.target.value);
    };   
    const handleGenderChange = (event) => {
      setPlace(event.target.value);
    };



      useEffect(()=>{
        if(termScale == 0){
          setTerm('1')
      } else if (termScale == 20){
          setTerm('7')
      } else if (termScale == 40){
          setTerm('30')
      } else if (termScale == 60){
          setTerm('60')
      } else if (termScale == 80){
          setTerm('90')
      } else if (termScale == 100){
          setTerm('90')
      }
    },[termScale])

  useEffect(() => {
    const handleClickOutside__1 = (event) => {
      if ((dropdownRef1__1.current && !dropdownRef1__1.current.contains(event.target)) ) {
        setIsOpenSkillsForm(false);

      }
    };

    document.addEventListener('mousedown', handleClickOutside__1);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside__1);
    };
  }, []);



  
useEffect(() => {
    const calculateScrollbarHeight1__1 = () => {
      const scrollContainerHeight1 = scrollContainerRef1__1.current.offsetHeight;
      const contentHeight1 = scrollContainerRef1__1.current.scrollHeight;
      const scrollbarHeightPercentage1 = (scrollContainerHeight1 / contentHeight1) * 100;
      setScrollbarHeight1__1(scrollbarHeightPercentage1);
    };



    calculateScrollbarHeight1__1();


    const handleResize__1 = () => {
      calculateScrollbarHeight1__1();

    };

    window.addEventListener('resize', handleResize__1);

    return () => {
      window.removeEventListener('resize', handleResize__1);
    };
  }, []);
  
  
  const toggleDropdownSkillsForm = () => {
    setIsOpenSkillsForm(!isOpenSkillsForm);
  };
  
  const selectSkills = (country) => {
    const isSelected = selectedSkills.includes(country[0]);
    const isSelected2 = selectedSkillsId.includes(country[1]);

    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(c => c !== country[0]));
      setSelectedSkillsId(selectedSkillsId.filter(c => c !== country[1]));

    } else {

      setSelectedSkills([...selectedSkills, country[0]]);
      setSelectedSkillsId([...selectedSkillsId, country[1]]);

    }
  };

  
  const handleScroll1__1 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage1 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight1__1(scrollbarHeightPercentage1);
  };


  
const fetchSkills = async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/skills?offset=${offset__1}&limit=${limit__1}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setSkills(prevCountries => [...newCountries]); // Добавляем загруженные страны к списку
    } catch (error) {

    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSkills(); // Call fetchCountries whenever searchQuery changes
  }, []);
  


  const patchOrder = async () => {
    const requestBody = {

        "title": `${title}`,
        "skills": [...selectedSkillsId],
        "task": `${phone}`,
        "is_online": place === 'offline' ? false : true,
        "price": Number(price),
        "duration": `${term}`,
        "location": place === 'offline' ? { "city_id":  `${selectedCity[1]}` } : null

    };

    try {

      const response = await fetch(`https://assista1.ru/api/v1/order/${order_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      });
      if (response.status === 401 || response.status === 400 ) {
        refreshTok()
      }
      if (response.ok) {
        const data = await response.json();
        
        props.tg.close()
      } 

      
    } catch (error) {
    }
};



  const filteredSkills = skills.filter((skill) =>{

     return skill.label.toLowerCase().includes(searchQuerySkills.toLowerCase())});








     const refreshTok = async () => {  
      let user = {
        refresh_token: `${refreshToken}`,
      };
    
      try {
        const response = await fetch('https://assista1.ru/api/v1/auth/refreshToken', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
        if (response.status === 200) {
          const responseData = await response.json();
          sessionStorage.setItem('accessToken', responseData.access_token)
          sessionStorage.setItem('refreshToken', responseData.refresh_token)
          setAccessToken(responseData.access_token)
          setRefreshToken(responseData.refresh_token)     
          // Handle response data if needed
        } else {
         const responseData = await response.json();
          // Handle response data if needed
           /* const data = {
                "status": "unauthorized"
            }
            props.tg.sendData(JSON.stringify(data))*/
            
            navigate('/failure_edit')
        }
      } catch (error) {
    
      }
    }

   const fetchOrders = async () => {
        try {
          const response = await fetch(`https://assista1.ru/api/v1/order/${order_id}`);
          const data = await response.json();
          setTitle(`${data.order.title}`)
          setPhone(`${data.order.task}`)
          if (data.order.is_online === true) {
            setPlace('online')
          } else {
            setPlace('offline')
          }
          setPrice(`${data.order.price}`)
          setTerm(`${data.order.duration}`)
          setSelectedSkillsId(data.order.skills.map(lang => lang[1]))

          setSelectedSkills(data.order.skills.map(lang => lang[0]))
          setCity(`${[data.order.location.city_title, data.order.location.city_id]}`)
          setSelectedCity([data.order.location.city_title, data.order.location.city_id])
          setSelectedCountry(`${[data.order.location.country_title, 'empty']}`);
          setSearchQueryCountry(`${data.order.location.country_title}`)
          setSearchQueryCity(`${data.order.location.city_title}`)
        } catch (error) {
        }
  };

  useEffect(() => {
    fetchOrders()
  },[])

  const [place, setPlace] = useState('offline')

  const [checkSelected,setCheckSelected] = useState('')

  const checkCityIfOffline = () => {
      if (place === 'offline' && selectedCity[1] == ''){
          setCheckSelected('false')
        } else if (place === 'offline' && selectedCity[1] !== ''){
          setCheckSelected('')
        }
    }
  useState(() => {
    checkCityIfOffline()
  },[place,price,term, selectedCity])
  
  return (
    <div className={s.greetings} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
         <div className={s.greetings_wrapper}>
        <div className={s.reg}>
            <h1 className={s.greetings_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Редактирование заказа</h1>
        </div>

          <div className={s.edit_input}>
            <input
                type={'text'}
                placeholder="Название"
                className={`${s.edit_field} ${errorFields.title && s.error}`}
                value={title}
                onChange={handleChangeTitle}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }

            />
            {title === '' && (errorFields.title && <span className={s.error_message}>Пожалуйста, введите логин</span>)}

        </div>
        <div className={s.edit_input2}>
            <textarea rows="10" cols="40" maxLength="1000"
                type={'text'}
                placeholder="Техническое задание"
                className={`${s.edit_field2} ${errorFields.phone && s.error}`}
                value={phone}
                onChange={handleChangePhone}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }

            />
        {phone === '' && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите описание</span>)}

        </div>



        <div className={`${s.radio_gender}`} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>
            <div>
                <input type="radio" id="online" name="place" value="online" checked={place === 'online'} onChange={handleGenderChange} />
                <label htmlFor="online" className={s.genderlabel}>Онлайн</label>
            </div>
            <div>
                <input type="radio" id="offline" name="place" value="offline" checked={place === 'offline'} onChange={handleGenderChange} />
                <label htmlFor="offline" className={s.genderlabel}>Оффлайн</label>
            </div>
          </div>
           {place === 'offline' &&
           
              <div className={s.dropdown_container} ref={dropdownRef}>
                        <input
                          type="text"
                          value={searchQueryCountry}
                          placeholder="Страна (Начните вводить...)"
                          onChange={(e) => {handleInputChange(e)}}
                          onClick={toggleDropdown}
                  
                          className={`${s.edit_field} ${props.colorB === 'light' ? s.light : s.dark}`}
                        />
                        <div className={`${s.dropdown_options} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenCountryForm ? s.open : ''}`}>
                          <div className={s.scroll_container} ref={scrollContainerRef} onScroll={handleScroll}>
                            {countries.map((country, index) => (
                              <div key={index} className={`${s.dropdown_option} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCountry([country.label, country.value])}>
                                {country.label}
                              </div>
                            ))}
                          </div>
                          <div className={`${s.scrollbar} ${props.colorB === 'light' ? s.light : s.dark}`} ref={scrollbarRef} style={{ height: `${scrollbarHeight}%` }} />
                        </div>
                        
                        {selectedCountry === '' && (errorFields.selectedCountry && <span className={s.error_message}>Выберите вашу страну</span>)}
                      </div>
                            }

                {place === 'offline' &&

                        <div className={s.dropdown_container2} ref={dropdownRef2}>
                          <input
                            type="text"
                            placeholder="Город (Начните вводить...)"
                            value={searchQueryCity}
                            className={`${s.edit_field} ${props.colorB === 'light' ? s.light : s.dark}`}
                            onChange={(e) => {handleInputChange2(e)}}
                            onClick={toggleDropdown2}
                          />
                          <div className={`${s.dropdown_options2} ${props.colorB === 'light' ? s.light : s.dark} ${isOpen2 ? s.open : ''}`}>
                            <div className={s.scroll_container2} ref={scrollContainerRef2} onScroll={handleScroll2}>
                            {cities.map((city, index) => (
                              <div key={index} className={`${s.dropdown_option2} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCity([city.label, city.value])}>
                                {city.label}
                              </div>
                            ))}
                          </div>
                         { <div className={`${s.scrollbar2} ${props.colorB === 'light' ? s.light : s.dark}`} ref={scrollbarRef2} style={{ height: `${scrollbarHeight2}%` }} />
                          }
                        </div>
                          {selectedCity === '' && (errorFields.selectedCity && <span className={s.error_message}>Выберите ваш город</span>)}
                        </div>       
                }



          <div className={s.dropdown_container__1} ref={dropdownRef1__1}>
          <input
            className={`${s.edit_field__1} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchQuerySkills}

            placeholder="Необходимые навыки"
            onClick={toggleDropdownSkillsForm}
            onChange={(e) => setSearchQuerySkills(e.target.value)}
            
          />
          <div  className={`${s.dropdown_options__1} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenSkillsForm ? s.open : ''}`}>
            <div  className={s.scroll_container__1} ref={scrollContainerRef1__1} onScroll={handleScroll1__1}>
              {filteredSkills.map((skill, index) => (
                <div key={index} className={`${s.dropdown_option__1} ${props.colorB === 'light' ? s.light : s.dark}`} >
                <label style={{ display: 'flex', alignItems: 'center', width:'300px' }} onClick={() => selectSkills([skill.label, skill.value])}>
                     <input
                     type="checkbox"
                     className={`${s.inputCheck__1} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedSkills.includes(' ' + skill.label)}
                     onChange={() => selectSkills([skill.label, skill.value])}
                     style={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: 10,
                     }}
                     />
                     {selectedSkills.includes(skill.label) && <img className={s.checkbox_icon__1__1}  src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                    
                      <span style={{ marginLeft: 10, width:'200px' }}>{skill.label}</span>
                 </label>
             </div>
              ))}
            </div>
          <div className={`${s.scrollbar_1__1} ${props.colorB === 'light' ? s.light : s.dark}`}  />
          
            </div>
          { selectedSkills.length === 0 && (errorFields.selectedSkills && <span className={s.error_message}>Пожалуйста, выберите навыки</span>)}
        </div>
            <div className={s.edit_input3}>
              <div style={{display:'flex'}}>
                <h3 style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Цена</h3>
              </div>
            <div style={{display:'flex', flexDirection: "column"}}>            <input
                type='number'
                placeholder=""
                className={`${s.edit_field3} ${errorFields.title && s.error}`}
                value={price}
                onChange={handleChangePrice}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
                        {price === '' && (errorFields.price && <span className={s.error_message}>Пожалуйста, введите цену</span>)}
              </div>
        </div>
            <div className={s.edit_input3}>
              
                <h3 style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Срок</h3>
<div style={{display:'flex', flexDirection: 'column'}}>   
            <input
                type='number'
                placeholder=""
                className={`${s.edit_field3} ${errorFields.title && s.error}`}
                value={term}
                onChange={handleChangeTerm}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#373737', color:'#C7C7C7'} }
            />
            {(errorFields.term && <span className={s.error_message}>Пожалуйста, укажите срок</span>)}
            </div>
        </div>
          <div className={s.likert_scale}>
            <input className={s.heigh} type="range" min="0" max="100" step="20" value={termScale} onChange={(e)=> {
            setTermScale(e.target.value) 
              }}
             />
    <div className={s.spanCreate} style={props.colorB === 'light' ? { color: 'black' } : { color: 'white' }}>
           <span className={s.span1}>1 дн</span>
            <span className={s.span2}>7 дн</span>
            <span className={s.span3}>30 дн</span>
            <span className={s.span4}>60 дн</span>
            <span className={s.span5}>90 дн</span>
            <span className={s.span6}>90+ дн</span>
          </div>
        </div>


           
      <Link to={(selectedCity === '') || (selectedCountry == '') || selectedSkillsId.length !== 0 || term !== '' ? `/update/${order_id}?access_token=${accessToken}&refresh_token=${refreshToken}&telegram_id=${telegram_id}` : `/update/${order_id}?access_token=${accessToken}&refresh_token=${refreshToken}&telegram_id=${telegram_id}`}>
        <button onClick={() => {
          validateFields()
          if (title !== ''  && phone !== ''   && selectedSkillsId.length !== 0 && term !== ''  && price !== '' && checkSelected !== 'false') {
            patchOrder()
          }
          
        }}className={`${s.greetings_btn} ${props.colorB === 'light' ? s.light : s.dark}`}>Редактировать</button>
      </Link>
      <Link to={(selectedCity === '') || (selectedCountry == '') ? `/update/:${order_id}?access_token=${accessToken}&refresh_token=${refreshToken}&telegram_id=${telegram_id}` : `/update/:${order_id}?access_token=${accessToken}&refresh_token=${refreshToken}&telegram_id=${telegram_id}`}>
        <button onClick={() => {
            props.tg.close()
        }}className={`${s.greetings_btn} ${s.greetings_btn1} ${props.colorB === 'light' ? s.light : s.dark}`}>Отменить</button>
      </Link>
      </div>
    </div>
  );
}

export default Edit;
