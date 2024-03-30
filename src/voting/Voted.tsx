interface Props {
  name: string;
}
const Voted = ({ name }: Props) => {
  return <div className="voted-c">Du hast abgestimmt für {name}</div>;
};

export default Voted;
