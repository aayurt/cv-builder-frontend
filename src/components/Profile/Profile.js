import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import swal from 'sweetalert';
import { AuthContext } from '../../App';
import Navbar from '../Navbar/Navbar';
import './Profile.css';

/*
const defaultFormData = {
  name: "",
  email: "",
  contactNo: "",
  bio: "",
  education: [
    {
      instituteName: "SXBA",
      startYear: "2014",
      endYear: "2018",
    },
    {
      instituteName: "Pace",
      startYear: "2019",
      endYear: "2020",
    },
  ],
  skills: ["Python", "C", "C++", "Java"],
  userType: "applicant",
  currInstituteName: "",
  currStartYear: "",
  currEndYear: "",
  currSkill: "",
  userType: "applicant",
};
*/

const languageList = [
  'Python',
  'C',
  'Javascript',
  'C++',
  'HTML',
  'CSS',
  'Java',
  'Rust',
  'Kotlin',
  'PHP',
];

function Profile() {
  const { auth, setAuth } = React.useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: auth.user.name,
    email: auth.user.email,
    contactNo: auth.user.contactNo,
    bio: auth.user.bio,
    education: auth.user.education,
    skills: auth.user.skills,
    userType: auth.userType,
    linkedIn: auth.user.linkedIn,
    github: auth.user.github,
    phone: auth.user.phone,
    website: auth.user.website,

    experiences: auth.user.experiences,
    interests: auth.user.interests,
    currInstituteName: '',
    currEmployerName: '',
    currStartYear: '',
    currEndYear: '',
    currExStartYear: '',
    currExEndYear: '',
    currSkill: '',
    currInterest: '',
    currEmployeeRole: '',
  });

  const onChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const bioNumWords = () => {
    let words = formData.bio.split(/\s+/);
    words.pop();
    return words.length;
  };

  const addSkill = () => {
    if (!formData.currSkill.trim())
      return swal('Error', "skill can't be empty", 'error');
    let newSkills = formData.skills;
    newSkills.push(formData.currSkill);
    setFormData({
      ...formData,
      skills: newSkills,
      currSkill: '',
    });
  };
  const addInterest = () => {
    if (!formData.currInterest.trim())
      return swal('Error', "skill can't be empty", 'error');
    let interestSkills = formData.interests;
    interestSkills.push(formData.currInterest);
    setFormData({
      ...formData,
      interests: interestSkills,
      currInterest: '',
    });
  };

  const handleSkillDelete = (skill) => {
    let newSkills = formData.skills.filter((sk) => sk !== skill);
    setFormData({
      ...formData,
      skills: newSkills,
    });
  };

  const handleInterestDelete = (interest) => {
    let newInterests = formData.interests.filter((sk) => sk !== interest);
    setFormData({
      ...formData,
      interests: newInterests,
    });
  };
  const addEducation = () => {
    if (!formData.currInstituteName.trim())
      return swal('Error', "Institute can't be empty", 'error');

    let re = /^(19|20)\d{2}$/;

    // start year
    if (!re.test(formData.currStartYear)) {
      return swal('Error', 'Invalid start year', 'error');
    }
    if (Number(formData.currStartYear) > 2021) {
      return swal('Error', 'Invalid start year', 'error');
    }
    // end year
    if (formData.currEndYear.trim() !== '') {
      if (!re.test(formData.currEndYear)) {
        return swal('Error', 'Invalid end year', 'error');
      }
      if (Number(formData.currEndYear) < Number(formData.currStartYear))
        return swal('Error', 'Invalid start and end years', 'error');
    }
    let newEducation = formData.education;
    newEducation.push({
      instituteName: formData.currInstituteName,
      startYear: formData.currStartYear,
      endYear: formData.currEndYear,
    });
    setFormData({
      ...formData,
      education: newEducation,
      currInstituteName: '',
      currEndYear: '',
      currStartYear: '',
    });
  };
  const addExperience = () => {
    if (!formData.currEmployerName.trim())
      return swal('Error', "Employer can't be empty", 'error');
    if (!formData.currEmployeeRole.trim())
      return swal('Error', "Employee role can't be empty", 'error');
    let re = /^(19|20)\d{2}$/;

    // start year
    if (!re.test(formData.currExStartYear)) {
      return swal('Error', 'Invalid start year', 'error');
    }
    if (Number(formData.currExStartYear) > 2021) {
      return swal('Error', 'Invalid start year', 'error');
    }
    // end year
    if (formData.currExEndYear.trim() !== '') {
      if (!re.test(formData.currExEndYear)) {
        return swal('Error', 'Invalid end year', 'error');
      }
      if (Number(formData.currExEndYear) < Number(formData.currExStartYear))
        return swal('Error', 'Invalid start and end years', 'error');
    }
    let newExperience = formData.experiences;
    newExperience.push({
      employerName: formData.currEmployerName,
      startYear: formData.currExStartYear,
      endYear: formData.currExEndYear,
      role: formData.currEmployeeRole,
    });
    setFormData({
      ...formData,
      experiences: newExperience,
      currInstituteName: '',
      currExEndYear: '',
      currExStartYear: '',
    });
  };

  const handleEducationDelete = (edu) => {
    let newEducation = formData.education.filter((ed) => ed !== edu);
    setFormData({
      ...formData,
      education: newEducation,
    });
  };
  const handleExperienceDelete = (edu) => {
    let newExperience = formData.experiences.filter((ed) => ed !== edu);
    setFormData({
      ...formData,
      experiences: newExperience,
    });
  };

  const updateUser = () => {
    let url = `/api/${auth.userType}/${auth.user._id.toString()}`;
    console.log(url);
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    };
    let data = formData;
    axios
      .put(url, data, config)
      .then((response) => {
        swal('Updated user', '', 'success');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setAuth({ ...auth, user: response.data.user });
      })
      .catch((error) => {
        if (error.response.data.msg) {
          swal('Error', error.response.data.msg, 'error');
        } else {
          swal('Error', 'Something went wrong', 'error');
        }
      });
  };

  const validateForm = () => {
    // email
    let emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(formData.email))
      return swal('Error', 'Invalid email', 'error');

    if (formData.userType === 'Recruiter') {
      let phoneRe = /^\d{10}$/;
      if (!phoneRe.test(formData.contactNo))
        return swal('Error', 'Invalid contact no', 'error');
      if (bioNumWords() > 250)
        return swal('Error', 'Bio must be less than 250 words', 'error');
    }

    updateUser();
  };
  const createAndDownloadPDF = () => {
    let url = `/api/pdf/fetch-pdf/${auth.user._id.toString()}`;

    axios
      .get(url, { responseType: 'blob' })
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, `${auth.user.name}'s Resume.pdf`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const generateCV = () => {
    let url = `/api/pdf/create-pdf/${auth.user._id.toString()}`;
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token'),
      },
    };
    axios
      .get(url, config)
      .then((response) => {
        createAndDownloadPDF();
      })
      .catch((error) => {});
  };

  return (
    <>
      <Navbar />
      <div className='Profile'>
        <div className='Profile-side'></div>
        <div className='Profile-header'>
          <Typography variant='h4'>Profile</Typography>
        </div>
        <div className='Profile-main'>
          <Typography variant='h5'>Basic details</Typography>
          <br />
          <form autoComplete='off'>
            <TextField
              fullWidth
              variant='outlined'
              label='Name'
              name='name'
              value={formData.name}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant='outlined'
              label='Email'
              name='email'
              value={formData.email}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant='outlined'
              label='LinkedIn'
              name='linkedIn'
              value={formData.linkedIn}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant='outlined'
              label='GitHub'
              name='github'
              value={formData.github}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant='outlined'
              label='Website'
              name='website'
              value={formData.website}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            <TextField
              fullWidth
              variant='outlined'
              label='Phone'
              name='phone'
              value={formData.phone}
              onChange={onChangeHandler}
            />
            <br />
            <br />
            {formData.userType == 'Recruiter' && (
              <>
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Contact No'
                  name='contactNo'
                  value={formData.contactNo}
                  onChange={onChangeHandler}
                />
                <br />
                <br />
              </>
            )}
            {formData.userType == 'Recruiter' && (
              <>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    variant='outlined'
                    multiline
                    rows='8'
                    label='Bio'
                    name='bio'
                    value={formData.bio}
                    onChange={onChangeHandler}
                  />
                  <FormHelperText>{bioNumWords()}/250</FormHelperText>
                </FormControl>
                <br />
                <br />
              </>
            )}
          </form>
          <br />
          <br />
          {formData.userType == 'Applicant' && (
            <>
              <Typography variant='h5'>Education</Typography>
              <br />
              <div className='EducationForm'>
                <TextField
                  variant='outlined'
                  label='Institute name'
                  name='currInstituteName'
                  value={formData.currInstituteName}
                  onChange={onChangeHandler}
                />
                <TextField
                  variant='outlined'
                  label='Start Year'
                  name='currStartYear'
                  value={formData.currStartYear}
                  onChange={onChangeHandler}
                />
                <TextField
                  variant='outlined'
                  label='End Year'
                  name='currEndYear'
                  value={formData.currEndYear}
                  onChange={onChangeHandler}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={addEducation}
                >
                  Add
                </Button>
              </div>
              <List className='EducationList' dense>
                {formData.education.map((edu) => {
                  return (
                    <ListItem
                      key={`${edu.instituteName}${edu.startYear}-${edu.endYear}`}
                    >
                      <ListItemText
                        primary={edu.instituteName}
                        secondary={`${edu.startYear}-${edu.endYear}`}
                      />
                      <IconButton
                        aria-label='delete'
                        onClick={() => handleEducationDelete(edu)}
                      >
                        X
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
              <br />
              <br />

              <Typography variant='h5'>Experience</Typography>
              <br />
              <div className='EducationForm'>
                <TextField
                  variant='outlined'
                  label='Employer name'
                  name='currEmployerName'
                  value={formData.currEmployerName}
                  onChange={onChangeHandler}
                />
                <TextField
                  variant='outlined'
                  label='Employee role'
                  name='currEmployeeRole'
                  value={formData.currEmployeeRole}
                  onChange={onChangeHandler}
                />

                <TextField
                  variant='outlined'
                  label='Start Year'
                  name='currExStartYear'
                  value={formData.currExStartYear}
                  onChange={onChangeHandler}
                />
                <TextField
                  variant='outlined'
                  label='End Year'
                  name='currExEndYear'
                  value={formData.currExEndYear}
                  onChange={onChangeHandler}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={addExperience}
                >
                  Add
                </Button>
              </div>
              <List className='EducationList' dense>
                {formData.experiences.map((exp) => {
                  return (
                    <ListItem
                      key={`${exp.employerName}${exp.startYear}-${exp.endYear}`}
                    >
                      <ListItemText
                        primary={`${exp.employerName} [${exp.role}]`}
                        secondary={`${exp.startYear}-${exp.endYear}`}
                      />
                      <IconButton
                        aria-label='delete'
                        onClick={() => handleExperienceDelete(exp)}
                      >
                        X
                      </IconButton>
                    </ListItem>
                  );
                })}
              </List>
              <br />
              <br />

              <Typography variant='h5'>Skills</Typography>
              <br />
              <div className='SkillForm'>
                <Autocomplete
                  freeSolo
                  options={languageList}
                  name='currSkill'
                  inputValue={formData.currSkill}
                  onInputChange={(e, newValue) => {
                    setFormData({ ...formData, currSkill: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label='Skill' variant='outlined' />
                  )}
                />
                <Button variant='contained' color='primary' onClick={addSkill}>
                  Add
                </Button>
              </div>
              <br />
              {formData.skills.map((skill) => {
                return (
                  <>
                    <Chip
                      className='SkillChip'
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                    />
                    <span></span>
                  </>
                );
              })}

              <br />
              <br />
              <Typography variant='h5'>Interests</Typography>
              <br />
              <div className='SkillForm'>
                <Autocomplete
                  freeSolo
                  options={languageList}
                  name='currInterest'
                  inputValue={formData.currInterest}
                  onInputChange={(e, newValue) => {
                    setFormData({ ...formData, currInterest: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Interest'
                      variant='outlined'
                    />
                  )}
                />
                <Button
                  variant='contained'
                  color='primary'
                  onClick={addInterest}
                >
                  Add
                </Button>
              </div>
              <br />
              {formData.interests.map((interest) => {
                return (
                  <>
                    <Chip
                      className='SkillChip'
                      key={interest}
                      label={interest}
                      onDelete={() => handleInterestDelete(interest)}
                    />
                    <span></span>
                  </>
                );
              })}

              <br />
              <br />
              <br />
              <br />
            </>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={generateCV}
            style={{ marginRight: 20, marginBottom: 160 }}
          >
            Generate CV
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={validateForm}
            style={{ marginRight: 20, marginBottom: 160 }}
          >
            Update
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => (window.location = '/')}
            style={{ marginRight: 20, marginBottom: 160 }}
          >
            Cancel
          </Button>
          <br />
          <br />
        </div>
      </div>
    </>
  );
}

export default Profile;
