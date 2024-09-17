import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="similar-jobs-list-item">
      <div className="details-container">
        <div className="logo-title-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="job-description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobs
