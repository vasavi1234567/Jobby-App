import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJob extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobData: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJob()
  }

  // eslint-disable-next-line
  getJob = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobDetailsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(item => ({
        companyLogoUrl: item.company_logo_url,
        companyWebsiteUrl: item.company_website_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        skills: item.skills.map(skill => ({
          imageUrl: skill.image_url,
          name: skill.name,
        })),
        lifeAtCompany: {
          description: item.life_at_company.description,
          imageUrl: item.life_at_company.image_url,
        },
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))

      const updatedSimilarJobsData = fetchedData.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    if (jobData.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        skills,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        title,
      } = jobData[0]
      return (
        <div className="job-details-bg">
          <div className="list-item">
            <div className="top-details-container">
              <div className="logo-title-container">
                <img
                  className="company-logo"
                  src={companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="title-rating-container">
                  <h1 className="jobs-title">{title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="rating-icon" />
                    <p className="rating">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="job-type-container">
                    <p className="job-type">{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="line" />
            <div className="middle-details-container">
              <div className="description-visit-container">
                <h1 className="description-heading">Description</h1>
                <a className="visit" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="description">{jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="skills-list-container">
              {skills.map(item => (
                <li className="list-item" key={item.name}>
                  <img
                    className="skill-image"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-company-details-container">
              <div className="heading-description-container">
                <h1>Life at company</h1>
                <p>{lifeAtCompany.description}</p>
              </div>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list-container">
            {similarJobsData.map(item => (
              <SimilarJobs
                key={item.id}
                employmentType={employmentType}
                similarJobData={item}
              />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  onRetryJobDetails = () => {
    this.getJob()
  }

  renderJobFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <div className="button-container">
        <button
          className="retry-button"
          type="button"
          onClick={this.onRetryJobDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default AboutJob
