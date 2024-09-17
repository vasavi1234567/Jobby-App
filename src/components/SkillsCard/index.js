const SkillsCard = props => {
  const {skillDetails} = props
  const {name, imageUrl} = skillDetails

  return (
    <li className="skill-item-container">
      <img className="skill-image" src={imageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillsCard
