import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImage =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
    profileData: [],
    jobsData: [],
    checkboxInput: [],
    searchInput: '',
    radioInput: '',
  }

  componentDidMound = () => {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApiUrl, options)
    if (response.ok === true) {
      const fetchedData = [await response.json()]
      const updatedData = fetchedData.map(item => ({
        profileImageUrl: item.profile_details.profile_image_url,
        name: item.profile_details.name,
        shortBio: item.profile_details.short_bio,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        profileData: updatedData,
        responseSuccess: true,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInput, searchInput, radioInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobsData: updatedData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  getRadioInput = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  getInput = event => {
    const {checkboxInput} = this.state
    const notListInput = checkboxInput.filter(item => item === event.target.id)
    if (notListInput.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobDetail,
      )
    } else {
      const filteredData = checkboxInput.filter(
        item => item !== event.target.id,
      )
      this.setState(
        // eslint-disable-next-line no-unused-vars
        prevState => ({checkboxInput: filteredData}),
        this.getJobDetails,
      )
    }
  }

  renderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {profileImageUrl, name, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img className="profile-icon" src={profileImageUrl} alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.getJobDetails()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        className="failure-image"
        src={failureViewImage}
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-content">
        We cannot seem to find the page you are looking for
      </p>
      <div className="failure-button-container">
        <button
          className="failure-button"
          type="button"
          onClick={this.onRetryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          className="no-jobs-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="jobs-container">
        {jobsData.map(item => (
          <JobCard key={item.id} jobData={item} />
        ))}
      </ul>
    )
  }

  renderJobsStatus = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.renderJobsView()
      case apiJobsStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  getCheckboxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(item => (
        <li className="list-item" key={item.employmentTypeId}>
          <input
            className="input"
            type="checkbox"
            id={item.employmentTypeId}
            onChange={this.getInput}
          />
          <label className="label" htmlFor={item.employmentTypeId}>
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getRadioButtonsView = () => (
    <ul className="radio-buttons-container">
      {salaryRangesList.map(item => (
        <li className="li-item" key={item.salaryRangeId}>
          <input
            className="radio"
            type="radio"
            name="option"
            id={item.salaryRangeId}
            onChange={this.getRadioInput}
          />
          <label className="label" htmlFor={item.salaryRangeId}>
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {checkboxInput, searchInput, radioInput} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="left-side-details-container">
            {this.renderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="employment-types">Type of Employment</h1>
            {this.getCheckboxesView()}
            <hr className="hr-line" />
            <h1 className="salary-range-heading">Salary Range</h1>
            {this.getRadioButtonsView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                label="text"
                className="search-button"
                data-testid="searchButton"
                type="button"
                onClick={this.onSubmitSearchInput()}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
