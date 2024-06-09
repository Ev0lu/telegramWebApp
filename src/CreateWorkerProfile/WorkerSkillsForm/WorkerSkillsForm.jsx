import React, { useRef, useState, useEffect } from 'react';
import s from './WorkerSkillsForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Vector from '../../assets/Vector.svg'

function WorkerSkillsForm(props) {
  const [skills, setSkills] = useState([])
  const [lang, setLang] = useState([])
  const [searchSkillsQuery, setSearchSkillsQuery] = useState('');
  const [searchLanguagesQuery, setSearchLanguagesQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isLanguageFormOpen, setIsLanguageFormOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkillsId, setSelectedSkillsId] = useState([]);


  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLanguagesId, setSelectedLanguagesId] = useState([]);

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const scrollContainerRef1 = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const [skillsOffset, setSkillsOffset] = useState(0);
  const [offsetLanguage, setOffsetLanguage] = useState(0);
  const [token, setToken] = useState('')
  useEffect(() => {
    setToken(sessionStorage.getItem('sessionToken'))
    fetchSkills(); 
    fetchLang(); // Call fetchCountries whenever searchQuery changes
  }, [])


  const skillsLimit = 25;
  const languagesLimit = 25;
  const [langLevels, setLangLevels] = useState([])
  const [selectedLangLevels, setSelectedLangLevels] = useState({});
  const [scrollbarHeight1, setScrollbarHeight1] = useState(0);
  const [scrollbarHeight2, setScrollbarHeight2] = useState(0);

//errors 
  const [errorFields, setErrorFields] = useState({
    selectedSkills: false,
    selectedLanguages: false
});

  const validateFields = () => {
    const errors = {
      selectedSkills: selectedSkills.length === 0,
      selectedLanguages: selectedLanguages.length === 0
    };
    setErrorFields(errors);
    return !Object.values(errors).some(Boolean);
  };


//func to register worker profile
const registerWorker = async () => {  
  let user = {
    profile: {
      telegram_id: Number(sessionStorage.getItem('tgId')),
      login: sessionStorage.getItem('login'),
      email: sessionStorage.getItem('mail'),
      full_name: sessionStorage.getItem('name') + ' ' + sessionStorage.getItem('lastName') + `${sessionStorage.getItem('middleName') !== null ? ' ' + sessionStorage.getItem('middleName') : ''}`,
      phone: sessionStorage.getItem('phone'),
      gender: sessionStorage.getItem('gender'),
      password: sessionStorage.getItem('password'),
    },
    worker:{
      location: {
        city_id: sessionStorage.getItem('selectedCity').split(',')[1]
      },
      languages: Object.values(selectedLangLevels),
      skills: [...selectedSkillsId]
      
    }
    
  };

  try {
    const response = await fetch(`https://assista1.ru/api/v1/auth/registration/worker`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-SESSION-TOKEN': `${sessionStorage.getItem('session_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('access_token', data.access_token)
      sessionStorage.setItem('profile_id', data.profile_id)
      sessionStorage.setItem('refresh_token', data.refresh_token)
      return navigate("/zak_reg_photo")
    } else if (response.status === 400 || response.status === 401) {
      return navigate("/success_r")
    }

  } catch (error) {
  }
}


//getting skills and langs
const fetchSkills = async () => {
  setLoading(true);
  try {
    const response = await fetch(`https://assista1.ru/api/v1/items/skills?offset=${skillsOffset}&limit=${skillsLimit}`);
    const data = await response.json();
    const newSkills = data.items.map(([skill, id]) => ({ label: skill, value: id }));
    setSkills(prevSkills => [...newSkills]); 
  } catch (error) {
  }

  setLoading(false);
};



const fetchLang = async () => {
  setLoading(true);
  try {
    const response = await fetch(`https://assista1.ru/api/v1/items/language?startswith=${searchLanguagesQuery}&offset=${offsetLanguage}&limit=${languagesLimit}`);
    const data = await response.json();
    const newLanguages = data.items.map(([language, id]) => ({ label: language, value: id }));
    setLang(prevCountries => [...prevCountries, ...newLanguages]); 
    setOffsetLanguage(prevOffset => prevOffset + languagesLimit); // increase offset for the next request
  } catch (error) {
  }

  setLoading(false);
};




//those useEffects are for checking click outside window
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((dropdownRef1.current && !dropdownRef1.current.contains(event.target)) && (dropdownRef2.current && !dropdownRef2.current.contains(event.target))) {
        setIsSkillFormOpen(false);
        setIsLanguageFormOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const calculateScrollbarHeight1 = () => {
      const scrollContainerHeight1 = scrollContainerRef1.current.offsetHeight;
      const contentHeight1 = scrollContainerRef1.current.scrollHeight;
      const scrollbarHeightPercentage1 = (scrollContainerHeight1 / contentHeight1) * 100;
      setScrollbarHeight1(scrollbarHeightPercentage1);
    };

    const calculateScrollbarHeight2 = () => {
      const scrollContainerHeight2 = scrollContainerRef2.current.offsetHeight;
      const contentHeight2 = scrollContainerRef2.current.scrollHeight;
      const scrollbarHeightPercentage2 = (scrollContainerHeight2 / contentHeight2) * 100;
      setScrollbarHeight2(scrollbarHeightPercentage2);
    };

    calculateScrollbarHeight1();
    calculateScrollbarHeight2();

    const handleResize = () => {
      calculateScrollbarHeight1();
      calculateScrollbarHeight2();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  //function to close form
  const toggleDropdownSkillForm = () => {
    setIsSkillFormOpen(!isSkillFormOpen);
  };

  const toggleDropdownLanguageForm = () => {
    setIsLanguageFormOpen(!isLanguageFormOpen);
  };


//select functions
  const selectSkills = (country) => {
    const isSelected = selectedSkills.includes(country[0]);
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(c => c !== country[0]));
      setSelectedSkillsId(selectedSkillsId.filter(c => c !== country[1]));
    } else {
      setSelectedSkills([...selectedSkills, country[0]]);
      setSelectedSkillsId([...selectedSkillsId, country[1]]);
    }
  };

  const selectLanguages = async (country) => {
    const isSelected = selectedLanguages.includes(country[0]);
    const isSelected2 = selectedLanguagesId.includes(country[1]);

    if (isSelected) {
        setSelectedLanguages(selectedLanguages.filter(c => c !== country[0]));
        setSelectedLanguagesId(selectedLanguagesId.filter(c => c !== country[1]));
        setSelectedLangLevels(prevLevels => {
            const updatedLevels = { ...prevLevels };
            delete updatedLevels[country[0]];
            return updatedLevels;
        });
        setLangLevels(prevLevels => {
            const updatedLevels = { ...prevLevels };
            delete updatedLevels[country[0]];
            return updatedLevels;
        });
    } else {
        setSelectedLanguages([...selectedLanguages, country[0]]);
        setSelectedLanguagesId([...selectedLanguagesId, country[1]]);
        try {
            const response = await fetch(`https://assista1.ru/api/v1/items/language/levels?language=${country[0]}`);
            if (response.ok) {
                const data = await response.json();
                const levels = data.items.map(([label, value]) => ({ label, value }));
                setLangLevels(prevLevels => ({
                    ...prevLevels,
                    [country[0]]: levels
                }));
                setSelectedLangLevels(prevLevels => ({
                    ...prevLevels,
                    [country[0]]: levels[0].value // По умолчанию выбираем первый уровень
                }));
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

  //these functions create invisible scrollbar to check, if client tried to scroll down and if it is, then we should load new list of array from fetch
  const handleScroll1 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage1 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight1(scrollbarHeightPercentage1);
  };

  const handleScroll2 = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollbarHeightPercentage2 = (clientHeight / scrollHeight) * 100;
    setScrollbarHeight2(scrollbarHeightPercentage2);
    if (
      scrollTop + clientHeight >= scrollHeight-30
    ) {
      if (!loading) {
        fetchLang(); // 
      }
    }
  };


useEffect(() => {
  setOffsetLanguage(0); // Reset offset to 0 when searchQuery changes
  setLang([]); 
  fetchLang();
}, [searchLanguagesQuery]);
  
//there is only 30 skills, that's why we don't need to make load function and useEffect when queryField changes
const filteredSkills = skills.filter((skill) =>{
     return skill.label.toLowerCase().includes(searchSkillsQuery.toLowerCase())
    }
  );

  return (
    <div className={s.personalSkills} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
     <div className={s.personalSkills_wrapper}>
        <div className={s.personalSkills_header}>
          <h1 className={s.personalSkills_text} style={props.colorB === 'light' ? { color: 'black' } : { color: 'white' }}>Осталось совсем немного</h1>
        </div>
        <div className={s.dropdown_container} ref={dropdownRef1}>
          <input
            className={`${s.personalSkills_field} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchSkillsQuery}
            placeholder="Ваши сильные навыки"
            onClick={toggleDropdownSkillForm}
            onChange={(e) => setSearchSkillsQuery(e.target.value)}
            
          />
          <div  className={`${s.dropdown_options} ${props.colorB === 'light' ? s.light : s.dark} ${isSkillFormOpen ? s.open : ''}`}>
            <div  className={s.scroll_container} ref={scrollContainerRef1} onScroll={handleScroll1}>
              {filteredSkills.map((country, index) => (
                <div key={index} className={`${s.dropdown_option} ${props.colorB === 'light' ? s.light : s.dark}`} >
                <label style={{ display: 'flex', alignItems: 'center', width:'300px' }} onClick={() => selectSkills([country.label, country.value])}>
                     <input
                     type="checkbox"
                     className={`${s.inputCheck} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + country.label)}
                     onChange={() => selectSkills([country.label, country.value])}
                     style={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginRight: 10,
                     }}
                     />
                     {selectedSkills.includes(country.label) && <img className={s.checkbox_icon__1}  src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                    
                      <span style={{ marginLeft: 10, width:'200px' }}>{country.label}</span>
                 </label>
             </div>
              ))}
            </div>
          <div className={`${s.scrollbar_1} ${props.colorB === 'light' ? s.light : s.dark}`}  />
            </div>
          { selectedSkills.length === 0 && (errorFields.selectedSkills && <span className={s.error_message}>Пожалуйста, выберите навыки</span>)}

        </div>

        <div className={s.dropdown_container__language} ref={dropdownRef2}>
          <input
            className={`${s.personalSkills_field__language} ${props.colorB === 'light' ? s.light : s.dark}`}
            type="text"
            value={searchLanguagesQuery}
            placeholder="Языки"
            onClick={toggleDropdownLanguageForm}
            onChange={(e) => setSearchLanguagesQuery(e.target.value)}

            
          />
          <div className={`${s.dropdown_options__language} ${props.colorB === 'light' ? s.light : s.dark} ${isLanguageFormOpen ? s.open : ''}`}>
            <div className={s.scroll_container__language} ref={scrollContainerRef2} onScroll={handleScroll2}>
              {lang.map((lang, index) => (
                <div key={index} className={`${s.dropdown_option__language} ${props.colorB === 'light' ? s.light : s.dark}`} >
                   <label style={{ display: 'flex', alignItems: 'center', width:'300px' }}>
                   {props.colorB === 'light' ? <input
                     type="checkbox"
                     className={`${s.inputCheck} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + lang.label)}
                     onChange={() => selectLanguages([lang.label, lang.value])}
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
                     className={`${s.inputCheck} ${props.colorB === 'light' ? s.light : s.dark}`}
                     checked={selectedLanguages.includes(' ' + lang.label)}
                     onChange={() => selectLanguages([lang.label, lang.value])}
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
                     {selectedLanguages.includes(lang.label) && <img className={s.checkbox_icon__1}  src={props.colorB === 'light' ? Vector : Vector} alt="checkmark"></img>}
                       
                         <span style={{ marginLeft: 10, width:'200px' }}>{lang.label}</span>
                    </label>
                </div>
              ))}
            </div> 
          <div className={`${s.scrollbar_1__1} ${props.colorB === 'light' ? s.light : s.dark}`} />
            </div>
          { selectedLanguages.length === 0 && (errorFields.selectedLanguages && <span className={s.error_message}>Пожалуйста, выберите языки</span>)}

        </div>
        <div className={s.language_wrapper}>
    {selectedLanguages.map((lang, index) => (
        <div key={index} className={s.language_select_wrapper}>
            <div className={s.language_label} style={props.colorB === 'light' ? { color: 'black' } : { color: 'white' }}>{lang}</div>
            <select
                className={s.language_select}
                style={props.colorB === 'light' ? { backgroundColor: 'white', color: 'black' } : { backgroundColor: '#373737', color: 'white'}}
                value={selectedLangLevels[lang] || ''}
                onChange={(e) => handleLevelChange(lang, e.target.value)}
            >
                {(langLevels[lang] || []).map((level, index) => (
                    <option key={index} value={level.value}>{level.label}</option>
                ))}
            </select>
        </div>
    ))}
</div>

        <Link to={selectedSkills.length !== 0 &&  selectedLanguages.length !== 0 ? '' : '/worker_skills_registration'}>
          <button onClick={() => {
            validateFields()
            sessionStorage.setItem('selectedLang', selectedLanguages)
            sessionStorage.setItem('selectedSkills', selectedSkills)
            sessionStorage.setItem('selectedLangId', selectedLanguagesId)
            sessionStorage.setItem('selectedSkillsId', selectedSkillsId)
            if ((selectedSkills.length !== 0) && (selectedLanguages.length !== 0) && (sessionStorage.getItem('login') !== null) && (sessionStorage.getItem('pass') !== null) && (sessionStorage.getItem('gender') !== null)  && (sessionStorage.getItem('phone') !== null)   && (sessionStorage.getItem('name') !== null)) {
              registerWorker()
            }

          }} className={`${s.personalSkills_btn} ${s.personalSkills_btn1}`}>Далее</button>
        </Link>
      </div>
    </div>
  );
}

export default WorkerSkillsForm;
