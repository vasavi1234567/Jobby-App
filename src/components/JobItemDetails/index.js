import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobData: {},
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobs()
  }

  getData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(skill => ({
      imageUrl: skill.image_url,
      name: skill.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getData(data.job_details)
      const updatedSimilarData = data.similar_jobs.map(similarJob =>
        this.getSimilarData(similarJob),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: updatedData,
        similarJobsData: updatedSimilarData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderFailureView = () => {
    const {match} = this.props
    const {params} = match
    // eslint-disable-next-line
    const {id} = params
    return (
      <div className="failure-view-container">
        <img
          className="failure-image"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
        <p className="failure-view-description">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="retry-button"
          type="button"
          id="button"
          onClick={this.getJobs}
        >
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsView = () => {
    const {jobData, similarJobsData} = this.state
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
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="jobs-view-container">
        <div className="jon-details-container">
          <div className="top-details-container">
            <div className="logo-title-container">
              <img
                className="company-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="title-rating-container">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-job-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location">{location}</p>
                </div>
                <div className="job-type-container">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p className="job-type">{employmentType}</p>
                </div>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a className="visit" href={companyWebsiteUrl}>
                Visit
              </a>
              <BiLinkExternal className="link-icon" />
            </div>
          </div>
          <p className="description-content">{jobDescription}</p>
          <h1 className="skills">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(skill => (
              <SkillsCard key={skill.name} skillDetails={skill} />
            ))}
          </ul>
          <h1 className="life-at-company">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">{description}</p>
            <img
              className="life-at-company-image"
              src={imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs">Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobsData.map(similarJob => (
            <SimilarJobs key={similarJob.id} jobDetails={similarJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
