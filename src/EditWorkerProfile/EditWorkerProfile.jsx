import React, { useRef, useState, useEffect } from 'react';
import s from './EditWorkerProfile.module.css';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import Vector from '../assets/Vector.svg'

function EditWorkerProfile(props) {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('')
  const [gender, setGender] = useState('');
  const [login, setLogin] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneConfirmed, setPhoneConfirmed] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [checkIsPhoneValid,setCheckIsPhoneValid] = useState('')
  const limit = 25; // Количество элементов, которые необходимо загрузить при каждом запросе
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState(searchParams.get('access_token'));
  const [refreshToken, setRefreshToken] = useState(searchParams.get('refresh_token'));
  const [telegram_id, setTelegram_id] = useState(searchParams.get('telegram_id'));

  // Получение значений параметров access_token и refresh_token из URL
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Таймаут для задержки запроса
  const [isCancelled, setIsCancelled] = useState(false); // Флаг отмены запроса
  //countries
  const [countries, setCountries] = useState([]);
  const [isOpenCountryForm, setIsOpenCountryForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Input value for country search
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const dropdownRef = useRef(null);
  const scrollContainerRef = useRef(null);

  //cities
  const [cities, setCities] = useState([])
  const [searchQueryCity, setSearchQueryCity] = useState(''); // Input value for country search
  const [isOpenCityForm, setIsOpenCityForm] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [loadingCities, setLoadingCities] = useState(false);
  const [offsetCities, setOffsetCities] = useState(0);
  const limitCities = 25; // Количество элементов, которые необходимо загрузить при каждом запросе

  const dropdownRefCity = useRef(null);
  const scrollContainerRefCity = useRef(null);
  const [scrollbarHeight2, setScrollbarHeight2] = useState(0);


  const handleChangeName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setName(sanitizedValue);
    };

  const handleChangeLastName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setLastName(sanitizedValue);
    };

  const handleChangeMiddleName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setMiddleName(sanitizedValue);
    };


  const handleGenderChange = (event) => {
      setGender(event.target.value);
    };

  const handleChangePhone = (event) => {
    const isValidPhone = /^\+/.test(event.target.value)
    if (isValidPhone === true) {
        setCheckIsPhoneValid('true')
    } else{
        setCheckIsPhoneValid('')
    }
    setPhone(event.target.value);
    setPhoneError('')
  };
    
    useEffect(() => {
      fetchSkills();
      fetchLang(); 
      fetchInfo();
    }, []);
  
  const [errorFields, setErrorFields] = useState({
    login: false,
    selectedCity: false,
    selectedCountry: false,
    name: false,
    lastName: false,
    gender: false,
    checkIsPhoneValid: false,
    phone: false,

  });

  const validateFields = () => {
    const errors = {
            selectedCity: selectedCity === '',
            selectedCountry: selectedCountry === '',
            phone: phone === '',
            checkIsPhoneValid: checkIsPhoneValid === '',
            name: name === '',
            lastName: lastName === '',
            login: login === ''   
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
      if (dropdownRefCity.current && !dropdownRefCity.current.contains(event.target)) {
        setIsOpenCityForm(false);
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

  const toggleDropdownCity = () => {
    setIsOpenCityForm(!isOpenCityForm);
  };

 const selectCountry = (country) => {
    setSelectedCountry(country);
    fetchCities()
    setSearchQuery(country[0]); // Update searchQuery with selected country label
    setIsOpenCountryForm(false);
  };

 const selectCity = (country) => {
    setSelectedCity(country);
    setSearchQueryCity(country[0]); // Update searchQuery with selected country label

    setIsOpenCityForm(false);
  };



  const fetchCountries = async () => {
    if (isCancelled) return;
    setLoading(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country?startswith=${searchQuery}&offset=${offset}&limit=${limit}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setCountries(prevCountries => [...prevCountries, ...newCountries]); // Добавляем загруженные страны к списку
      setOffset(prevOffset => prevOffset + limit); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }
    setLoading(false);
  };

  const fetchCities = async () => {
    if (isCancelled) return;
    if (selectedCountry[1] === '' || selectedCountry[1] === undefined) {
      return;
    }

    setLoadingCities(true);

    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/country/cities?country_id=${selectedCountry[1]}&startswith=${searchQueryCity}&offset=${offsetCities}&limit=${limitCities}`);
      const data = await response.json();
      const newCities = data.items.map(([citys, id]) => ({ label: citys, value: id }));

      setCities(prevCountries => [...prevCountries, ...newCities]); 
      setOffsetCities(prevOffset => prevOffset + limitCities); 
    } catch (error) {
    }

    setLoadingCities(false);
  };

useEffect(() => {
  setOffset(0); // Reset offset to 0 when searchQuery changes
  setCountries([]); // Reset countries list to empty when searchQuery changes
}, [searchQuery]);
useEffect(() => {
  setOffsetCities(0); // Reset offset to 0 when searchQuery changes
  setCities([]); // Reset countries list to empty when searchQuery changes
}, [searchQueryCity]);


  useEffect(() => {
        setSelectedCity(sessionStorage.getItem('selectedCity') !== null ? sessionStorage.getItem('selectedCity') : '')
        setSelectedCountry(sessionStorage.getItem('selectedCountry') !== null ? sessionStorage.getItem('selectedCountry') : '')
      }, [])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight(scrollbarHeightPercentage);
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loading) {
        setIsCancelled(false); 
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        if (searchQuery !== ''){

        const timeout = setTimeout(() => {
          fetchCountries();
        }, 300); // Задержка выполнения запроса на 300 миллисекунд после последнего изменения поискового запроса
      
        setDebounceTimeout(timeout);
      }
        return () => {
          setIsCancelled(true); // Установка флага отмены перед размонтированием компонента
        }; // Загружаем следующую порцию стран при достижении конца прокрутки
      }
    }
  };

    const handleScrollCity = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight2(scrollbarHeightPercentage);
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loadingCities) {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        if (searchQueryCity !== ''){
          setIsCancelled(false);

        const timeout = setTimeout(() => {
          fetchCities();
        }, 300);
        setDebounceTimeout(timeout);
        // Задержка выполнения запроса на 300 миллисекунд после последнего изменения поискового запроса
      }
        return () => {
          setIsCancelled(true); // Установка флага отмены перед размонтированием компонента
        }; // Загружаем следующую порцию стран при достижении конца прокрутки
      }
    }
  };
  
useEffect(() => {
  if (searchQuery !== ''){
    setIsCancelled(false);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (searchQuery !== ''){

    const timeout = setTimeout(() => {
      fetchCountries();
    }, 300); // Задержка выполнения запроса на 300 миллисекунд после последнего изменения поискового запроса

    setDebounceTimeout(timeout);
  }
    return () => {
      setIsCancelled(true); // Установка флага отмены перед размонтированием компонента
    };// Call fetchCountries whenever searchQuery changes
  }
}, [searchQuery]);

useEffect(() => {
  setIsCancelled(false);
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  if (searchQueryCity !== ''){
    const timeout = setTimeout(() => {
      fetchCities();
    }, 300); // Задержка выполнения запроса на 300 миллисекунд после последнего изменения поискового запроса

    setDebounceTimeout(timeout);
}
  return () => {
    setIsCancelled(true); // Установка флага отмены перед размонтированием компонента
  }; // Call fetchCountries whenever searchQuery changes
}, [searchQueryCity]);

const handleInputChange = (e) => {
  const newSearchQuery =   e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  setSearchQuery(newSearchQuery);
  setOffset(0); // Reset offset to 0 whenever searchQuery changes
};

const handleInputChangeCity = (e) => {
  const newSearchQuery =  e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  setSearchQueryCity(newSearchQuery);
  setOffsetCities(0);
};

  const [skillsList, setSkillsList] = useState([])
  const [searchQuerySkills, setSearchQuerySkills] = useState('');
  const [isOpenSkillsForm, setIsOpenSkillsForm] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkillsId, setSelectedSkillsId] = useState([]);

  const [isOpenLanguagesForm, setIsOpenLanguagesForm] = useState(false);
  const [languagesList, setLanguagesList] = useState([])
  const [searchQueryLanguages, setSearchQueryLanguages] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLanguagesId, setSelectedLanguagesId] = useState([]);
  const [langLevels, setLangLevels] = useState({});
  const [selectedLangLevels, setSelectedLangLevels] = useState({});
  const dropdownRefSkills = useRef(null);
  const dropdownRefLanguages = useRef(null);
  const scrollContainerRefLanguages = useRef(null);
  const scrollContainerRefSkills = useRef(null);
  const [offset__2, setOffset__2] = useState(0);
  const [offset2__2, setOffset2__2] = useState(0);

  const limit__2 = 25;
  const limit2__2 = 25;

  const [scrollbarHeight1__2, setScrollbarHeight1__2] = useState(0);
  const [scrollbarHeight2__2, setScrollbarHeight2__2] = useState(0);
 

  useEffect(() => {
    const handleClickOutside__2 = (event) => {
      if ((dropdownRefSkills.current && !dropdownRefSkills.current.contains(event.target)) && (dropdownRefLanguages.current && !dropdownRefLanguages.current.contains(event.target))) {
        setIsOpenSkillsForm(false);
        setIsOpenLanguagesForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside__2);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside__2);
    };
  }, []);

  useEffect(() => {
    const calculateScrollbarHeight1__2 = () => {
      const scrollContainerHeight1 = scrollContainerRefLanguages.current.offsetHeight;
      const contentHeight1 = scrollContainerRefLanguages.current.scrollHeight;
      const scrollbarHeightPercentage1 = (scrollContainerHeight1 / contentHeight1) * 100;
      setScrollbarHeight1__2(scrollbarHeightPercentage1);
    };

    const calculateScrollbarHeight2__2 = () => {
      const scrollContainerHeight2 = scrollContainerRefCity.current.offsetHeight;
      const contentHeight2 = scrollContainerRefCity.current.scrollHeight;
      const scrollbarHeightPercentage2 = (scrollContainerHeight2 / contentHeight2) * 100;
      setScrollbarHeight2__2(scrollbarHeightPercentage2);
    };

    calculateScrollbarHeight1__2();
    calculateScrollbarHeight2__2();

    const handleResize__2 = () => {
      calculateScrollbarHeight1__2();
      calculateScrollbarHeight2__2();
    };

    window.addEventListener('resize', handleResize__2);

    return () => {
      window.removeEventListener('resize', handleResize__2);
    };
  }, []);

  const toggleDropdownSkills = () => {
    setIsOpenSkillsForm(!isOpenSkillsForm);
  };

  const toggleDropdownLanguages = () => {
    setIsOpenLanguagesForm(!isOpenLanguagesForm);
  };

  const selectSkills = (skill) => {
    const isSelected = selectedSkills.includes(skill[0]);
    const isSelected2 = selectedSkillsId.includes(skill[1]);
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(c => c !== skill[0]));
      setSelectedSkillsId(selectedSkillsId.filter(c => c !== skill[1]));
    } else {
      setSelectedSkills([...selectedSkills, skill[0]]);
      setSelectedSkillsId([...selectedSkillsId, skill[1]]);
    }
  };

  const selectLanguage = async (language) => {
    const isSelected = selectedLanguages.includes(language[0]);
    const isSelected2 = selectedLanguagesId.includes(language[1]);
    if (isSelected) {
          try {
            const response = await fetch(`https://assista1.ru/api/v1/items/language/levels?language=${language[0]}`);
            if (response.ok) {
                const data = await response.json();
                const levelsToDelete = data.items.map(level => level[1]);
                const indexToRemove = selectedLanguages.indexOf(language[0]);
                setSelectedLanguagesId(prev => {
                  const updated = [...prev];
                  updated.splice(indexToRemove, 1);              // Если ничего не удалено через filter
                /* if (selectedLanguages[0] === language[0]){
                    if (updated.length === prev.length) {
                      updated = prev.slice(1); // Удалить первый элемент массива
                  }              }
                  if (selectedLanguages[selectedLanguages.length - 1] === language[0]){
                    if (updated.length === prev.length) {
                      updated = prev.slice(0, -1); // Удалить первый элемент массива
                  }
                }*/
        
                  return updated;
              });
                setSelectedLanguages(prev => prev.filter(label => label !== language[0]));


              setSelectedLangLevels(prevLevels => {
                const updatedLevels = { ...prevLevels };
                levelsToDelete.forEach(levelId => {
                    if (levelId in updatedLevels) {
                        delete updatedLevels[levelId];
                    }
                });
                return updatedLevels;
            });
            setLangLevels(prevLevels => {
              const updatedLevels = { ...prevLevels };
              delete updatedLevels[language[1]];
              return updatedLevels;
          });
            } else {
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    } else {
        setSelectedLanguages([...selectedLanguages, language[0]]);
        setSelectedLanguagesId([...selectedLanguagesId, language[1]]);
        try {
            const response = await fetch(`https://assista1.ru/api/v1/items/language/levels?language=${language[0]}`);
            if (response.ok) {
              const data = await response.json();
              if (data && data.items && data.items.length > 0) {
                  const levels = data.items.map(([label, value]) => ({ label, value }));
                  setLangLevels(prevLevels => ({
                      ...prevLevels,
                      [language[1]]: levels 
                  }));
                  setSelectedLangLevels(prevLevels => ({
                      ...prevLevels,
                      [language[1]]: levels[0].value 
                  }));
              } else {
              }
            } else {
            }
        } catch (error) {
        }
    }
};

const handleLevelChange = (language, level) => {
    setSelectedLangLevels(prevLevels => ({
        ...prevLevels,
        [language]: level
    }));
};

  const handleScroll1__2 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage1 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight1__2(scrollbarHeightPercentage1);
  };

  const handleScroll2__2 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage2 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight2__2(scrollbarHeightPercentage2);
  };

const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/skills?offset=${offset__2}&limit=${limit__2}`);
      const data = await response.json();
      const newCountries = data.items.map(([country, id]) => ({ label: country, value: id }));

      setSkillsList(prevCountries => [...newCountries]); // Добавляем загруженные страны к списку
    } catch (error) {
    }

    setLoading(false);
  };

  const fetchLang = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://assista1.ru/api/v1/items/language?startswith=${searchQueryLanguages}&offset=${offset__2}&limit=${limit__2}`);
      const data = await response.json();
      const newLanguages = data.items.map(([country, id]) => ({ label: country, value: id }));
      setLanguagesList(prevLanguages => [...prevLanguages, ...newLanguages]); // Добавляем загруженные страны к списку
      setOffset2__2(prevOffset => prevOffset + limit2__2); // Увеличиваем offset для следующего запроса
    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    setOffset2__2(0); // Reset offset to 0 when searchQuery changes
    setLanguagesList([]); 
    fetchLang();
  }, [searchQueryLanguages]);
  
  const filteredSkills = skillsList.filter((skill) => {
     return skill.label.toLowerCase().includes(searchQuerySkills.toLowerCase())
    }
  );
  
  const fetchInfo = async () => {
    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/me`,{
        method: 'GET',
        headers: {
           'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (response.status === 401){
        refreshTok() 
      } else {
      const data = await response.json();
    
      setLogin(`${data.login}`)
      setName(`${data.full_name.split(' ')[0]}`)
      setLastName(`${data.full_name.split(' ')[1]}`)
      setMiddleName(data.full_name.split(' ')[2] ? `${data.full_name.split(' ')[2]}` : '')
      setGender(`${data.gender}`)
      setPhone(`${data.phone.split('-').join('')}`)
      setPhoneConfirmed(`${data.phone.split('-').join('')}`)
      setCheckIsPhoneValid('exist')
      setSelectedLanguagesId(data.worker.languages.map(lang => lang[0]))
      setSelectedLanguages(data.worker.languages.map(lang => lang[1]))
      setSelectedSkills(data.worker.skills.map(lang => lang[0]))
      setSelectedSkillsId(data.worker.skills.map(lang => lang[1]))
      selectCountry(['', ''])
      selectCity(['', data.worker.location.city_id])
      try {
        const tempLangLevels = {  };
        const tempSelectedLangLevels = {  };
        const levels = data.worker.languages.map(lang => ({ label: lang[2], value: lang[0], name: lang[1] }));

        for (const lang of levels) {

          const response = await fetch(`https://assista1.ru/api/v1/items/language/levels?language=${lang.name}`);
          if (response.ok) {
              const data = await response.json();
              if (data && data.items && data.items.length > 0) {
                
                  const fetchedLevels = data.items.map(([level, id]) => ({ label: level, value: id }));

                  tempLangLevels[lang.value] = fetchedLevels;
                  const selectedLevel = fetchedLevels.find(level => level.label === lang.label);

                  if (selectedLevel) {
                      tempSelectedLangLevels[lang.value] = selectedLevel.value;
                  } else {
                      tempSelectedLangLevels[lang.value] = fetchedLevels[0].value;
                  }
              } else {
              }
          } else {
          }
        }
      setLangLevels(tempLangLevels);
      setSelectedLangLevels(tempSelectedLangLevels);
      } catch (error) {
        console.error('Ошибка сети:', error);
      }
      setLangLevels(levels);
    }
    } catch (error) {
    }
  };

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
      if (response.ok) {
        const responseData = await response.json();
        sessionStorage.setItem('accessToken', responseData.access_token)
        setRefreshToken(responseData.refresh_token)     
        // Handle response data if needed
  
      } else {
       const responseData = await response.json();
        // Handle response data if needed
          const data = {
              "status": "unauthorized"
          }
          props.tg.sendData(JSON.stringify(data))
          props.tg.close()

      }
    } catch (error) {
  
    }
  }

const patchProfile = async () => {
    const requestBody = {
        "location": {
          "city_id": `${selectedCity[1]}`
        },    
        "languages": Object.values(selectedLangLevels),
        "skills": [...selectedSkillsId],
        "profile": {
          "full_name": name + ' ' + lastName + `${middleName !== '' ? ' ' + middleName : ''}`,
          "gender": `${gender}`,
          "phone": `${phone}`
        }
    };

    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/update/worker`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        props.tg.sendData(JSON.stringify(data))

        // Обработка полученных данных
      } else if (response.status === 401) {
          refreshTok()
        
      } else if (response.status === 400){
        const responseData = await response.json();
        if (responseData.detail.includes("phone")) {
           setPhoneError('true')
          setMessageerr('Указанный телефон уже существует')
        }} else if (response.status === 422){
           setPhoneError('true')
           setMessageerr('Телефон не валиден')
        }
    } catch (error) {
    }
};

     
  return (
    <div className={s.editProfile} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
         <div className={s.editProfile_wrapper}>
        <div className={s.reg}>
            <h1 className={s.editProfile_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Редактирование профиля</h1>
        </div>

        <div className={`${s.edit_input}`}>
            <input
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }

                type={'text'}
                placeholder="Имя*"
                className={`${s.edit_field} ${errorFields.name && s.error}`}
                value={name}
                onChange={handleChangeName}
            />
            { name === '' && (errorFields.name && <span className={s.error_message}>Пожалуйста, введите дату рождения</span>)}

        </div>
           
        <div className={`${s.edit_input}`}>
            <input
            style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }                type={'text'}
                placeholder="Фамилия*"
                className={`${s.edit_field} ${errorFields.lastName && s.error}`}
                value={lastName}
                onChange={handleChangeLastName}
            />
            { lastName === '' && (errorFields.lastName && <span className={s.error_message}>Пожалуйста, введите фамилию</span>)}
        </div>
        <div className={s.edit_input3}>
            <input
style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }                type={'text'}
                placeholder="Отчество"
                className={s.edit_field}
                value={middleName}
                onChange={handleChangeMiddleName}
            />

        </div>
        <div className={s.edit_input}>
            <input
                type={'text'}
                placeholder="Номер телефона"
                className={`${s.edit_field} ${(errorFields.phone || errorFields.checkIsPhoneValid) && s.error}`}
                value={phone}
                onChange={handleChangePhone}
                style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
            />
        {phoneConfirmed === '' && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите телефон</span>)}
        {phone.split('').length < 7 && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите правильный телефон</span>)}
        {errorFields.checkIsPhoneValid && <span className={s.error_message}>Номер должен начинаться с кода страны(+...)</span>}


        </div>
          
        <div className={`${s.radio_gender}`} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>
            <label htmlFor="gender" style={{ fontSize: '14px' }}>Ваш пол:</label>
            <div>
                <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
                <label htmlFor="male" className={s.genderlabel}>Мужской</label>
            </div>
            <div>
                <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
                <label htmlFor="female" className={s.genderlabel}>Женский</label>
            </div>
        </div>



    
           
              <div className={s.dropdown_container} ref={dropdownRef}>
                        <input
                          type="text"
                          value={searchQuery}
                          placeholder="Страна  (Начните вводить...)"
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
                       {   <div className={`${s.scrollbar_1} ${props.colorB === 'light' ? s.light : s.dark}`} style={{ height: `90%`}} />
                         // <div className={`${s.scrollbar} ${props.colorB === 'light' ? s.light : s.dark}`} ref={scrollbarRef} style={{ height: `${scrollbarHeight}%` }} />
                          }  
                        </div>
                        
                        {selectedCountry === '' && (errorFields.selectedCountry && <span className={s.error_message}>Выберите вашу страну</span>)}
                      </div>
                            
                        <div className={s.dropdown_container2} ref={dropdownRefCity}>
                          <input
                            type="text"
                            placeholder="Город  (Начните вводить...)"
                            value={searchQueryCity}
                            className={`${s.edit_field} ${props.colorB === 'light' ? s.light : s.dark}`}
                            onChange={(e) => {handleInputChangeCity(e)}}
                            onClick={toggleDropdownCity}
                          />
                          <div className={`${s.dropdown_options2} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenCityForm ? s.open : ''}`}>
                            <div className={s.scroll_container2} ref={scrollContainerRefCity} onScroll={handleScrollCity}>
                            {cities.map((citymap, index) => (
                              <div key={index} className={`${s.dropdown_option2} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => selectCity([citymap.label, citymap.value])}>
                                {citymap.label}
                              </div>
                            ))}
                          </div>
                       {   <div className={`${s.scrollbar_12} ${props.colorB === 'light' ? s.light : s.dark}`} style={{ height: `90%`}} />
                         // <div className={`${s.scrollbar2} ${props.colorB === 'light' ? s.light : s.dark}`} ref={scrollbarRef2} style={{ height: `${scrollbarHeight2}%` }} />
                          }  
                        </div>
                          {selectedCity === '' && (errorFields.selectedCity && <span className={s.error_message}>Выберите ваш город</span>)}
                  
                        </div>
                        
                
        <div className={s.dropdown_container__2} ref={dropdownRefSkills}>
          <input
            className={`${s.edit_field__2} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchQuerySkills}

            placeholder="Ваши сильные навыки"
            onClick={toggleDropdownSkills}
            onChange={(e) => setSearchQuerySkills(e.target.value)}
            
          />
          <div className={`${s.dropdown_options__2} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenSkillsForm ? s.open : ''}`}>
            <div  className={s.scroll_container__2} ref={scrollContainerRefLanguages} onScroll={handleScroll1__2}>
              {filteredSkills.map((skill, index) => (
                <div key={index} className={`${s.dropdown_option__2} ${props.colorB === 'light' ? s.light : s.dark}`} >
                <label style={{ display: 'flex', alignItems: 'center', width:'300px' }} onClick={() => selectSkills([skill.label, skill.value])}>
                     <input
                     type="checkbox"
                     className={`${s.inputCheck__2} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + skill.label)}

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
                     {selectedSkills.includes(skill.label) && <img className={s.checkbox_icon__1__2}  src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                    
                      <span style={{ marginLeft: 10, width:'200px' }}>{skill.label}</span>
                 </label>
             </div>
              ))}
            </div>
           { <div className={`${s.scrollbar_1__2} ${props.colorB === 'light' ? s.light : s.dark}`}  />
           // <div className={`${s.scrollbar__2} ${props.colorB === 'light' ? s.light : s.dark}`} ref={scrollbarRef1__2} style={{ height: `${scrollbarHeight1__2}%` }} />
            }
            </div>
          { selectedSkills.length === 0 && (errorFields.selectedSkills && <span className={s.error_message}>Пожалуйста, выберите навыки</span>)}

        </div>

        <div className={s.dropdown_container__1__2} ref={dropdownRefLanguages}>
          <input
            className={`${s.edit_field__1__2} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchQueryLanguages}
            placeholder="Языки"
            onClick={toggleDropdownLanguages}
            onChange={(e) => setSearchQueryLanguages(e.target.value)}

            
          />
          <div className={`${s.dropdown_options__1__2} ${props.colorB === 'light' ? s.light : s.dark} ${isOpenLanguagesForm ? s.open : ''}`}>
            <div className={s.scroll_container__1__2} ref={scrollContainerRefSkills} onScroll={handleScroll2__2}>
              {languagesList.map((lang, index) => (
                <div key={index} className={`${s.dropdown_option__1__2} ${props.colorB === 'light' ? s.light : s.dark}`} >
                   <label style={{ display: 'flex', alignItems: 'center', width:'300px' }}>
                   {props.colorB === 'light' ? <input
                     type="checkbox"
                     className={`${s.inputCheck__2} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + lang.label)}
                     onChange={() => {
                      selectLanguage([lang.label, lang.value])}}
                     style={{
                      width: 20,
                      height: 20,
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: 10,
                    }}/>
                    :
                    <input
                     type="checkbox"
                     className={`${s.inputCheck__2} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + lang.label)}
                     onChange={() => {
                      selectLanguage([lang.label, lang.value])}
                    }                  
                       style={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#232323',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: 10,
                    }}
      
                     /> 
                    }
                     {selectedLanguages.includes(lang.label) && <img className={s.checkbox_icon__1__2}  src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                       
                         <span style={{ marginLeft: 10, width:'200px' }}>{lang.label}</span>
                    </label>
                </div>
              ))}
            </div>
            
          {  <div className={`${s.scrollbar_1__1__2} ${props.colorB === 'light' ? s.light : s.dark}`} />
           // <div className={`${s.scrollbar__1__2} ${props.colorB === 'light' ? s.light : s.dark}`}  ref={scrollbarRef2__2} style={{ height: `${scrollbarHeight2__2}%` }} />
            }
            </div>
          { selectedLanguages.length === 0 && (errorFields.selectedLanguages && <span className={s.error_message}>Пожалуйста, выберите языки</span>)}

        </div>
        <div className={s.language_wrapper}>
            {selectedLanguages.map((lang, index) => (
                <div key={index} className={s.language_select_wrapper}>
                    <div className={s.language_label} style={props.colorB === 'light' ? { color: 'black' } : { color: 'white' }}>{lang}</div>
                    <select
                        className={s.language_select}
                        style={props.colorB === 'light' ? { backgroundColor: 'white', color: 'black' } : { backgroundColor: '#373737', color: 'white' }}
                        value={selectedLangLevels[selectedLanguagesId[index]] || ''}
                        onChange={(e) => handleLevelChange(selectedLanguagesId[index], e.target.value)}
                    >
                        {(langLevels[selectedLanguagesId[index]] || []).map((level, index) => (
                            <option key={index} value={level.value}>{level.label}</option>
                        ))}
                    </select>
                </div>
            ))}
           { selectedLanguagesId.length === 0 && (<span className={s.error_message2}>Пожалуйста, выберите языки</span>)}
        </div>

           
      <Link to={(selectedCity === '') || (selectedCountry == '') ? '/update/worker' : '/update/worker'}>
        <button onClick={() => {
          validateFields()
          if (selectedLangLevels.length !== 0 && selectedLanguagesId.length !== 0 && name !== '' && lastName !== '' && selectedSkills.length !== 0 && phone !== '' && phoneError == ''){
               patchProfile()
          }

        }} className={`${s.editProfile_btn} ${props.colorB === 'light' ? s.light : s.dark}`}>Применить</button>
      </Link>
      <Link to={(selectedCity === '') || (selectedCountry == '') ? '/update/worker' : '/update/worker'}>
        <button onClick={() => {
            props.tg.close()
        }} className={`${s.editProfile_btn} ${s.editProfile_btn1} ${props.colorB === 'light' ? s.light : s.dark}`}>Отменить</button>
      </Link>
      </div>
    </div>
  );
}

export default EditWorkerProfile;
