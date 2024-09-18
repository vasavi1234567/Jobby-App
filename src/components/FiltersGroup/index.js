import {BsSearch} from 'react-icons/bs'
import Profile from '../Profile'
import './index.css'

const FiltersGroup = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const renderSearchInput = () => {
    const {getJobs, searchInput} = props
    return (
      <div className="search-input-container">
        <input
          className="search-input"
          type="search"
          id="searchInput"
          placeholder="Search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <button
          label="text"
          className="search-button"
          type="button"
          id="searchButton"
          onClick={getJobs}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  const onSelectEmploymentType = event => {
    const {changeEmployeeList} = props
    changeEmployeeList(event.target.value)
  }

  const onSelectLocation = event => {
    const {changeLocation} = props
    changeLocation(event.target.value)
  }

  const renderEmploymentType = () => {
    const {employmentTypesList} = props
    return (
      <div className="employment-type-container">
        <h1 className="employment-heading">Type of Employment</h1>
        <ul className="types-list-container">
          {employmentTypesList.map(jobType => (
            <li className="job-item" key={jobType.employmentTypeId}>
              <input
                className="input"
                type="checkbox"
                id={jobType.employmentTypeId}
                value={jobType.employmentTypeId}
                onChange={onSelectEmploymentType}
              />
              <label className="label" htmlFor={jobType.employmentTypeId}>
                {jobType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div className="salary-ranges-container">
        <h1 className="salary-range">Salary Range</h1>
        <ul className="list-container">
          {salaryRangesList.map(salary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(salary.salaryRangeId)
            }
            return (
              <li
                className="salary-item"
                key={salary.salaryRangeId}
                onClick={onClickSalary}
              >
                <input
                  className="input"
                  type="radio"
                  name="salary"
                  id={salary.salaryRangeId}
                />
                <label className="label" htmlFor={salary.salaryRangeId}>
                  {salary.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const renderLocations = () => {
    const {Locations} = props
    return (
      <div className="employment-type-container">
        <h1 className="employment-heading">Locations</h1>
        <ul className="types-list-container">
          {Locations.map(jobType => (
            <li className="job-item" key={jobType.locationId}>
              <input
                className="input"
                type="checkbox"
                id={jobType.locationId}
                value={jobType.locationId}
                onChange={onSelectLocation}
              />
              <label className="label" htmlFor={jobType.locationId}>
                {jobType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      <Profile />
      <hr className="hr-line" />
      {renderEmploymentType()}
      <hr className="hr-line" />
      {renderSalaryRange()}
      <hr className="hr-line" />
      {renderLocations()}
    </div>
  )
}

export default FiltersGroup
