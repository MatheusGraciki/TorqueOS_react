import "./styles.scss";

type Props = {
  text: string;
};

export const LoadingState = ({ text }: Props) => {
  return (
    <div className="servicos-loading">
      <div className="servicos-loading-spinner"></div>
      <p className="servicos-loading-text">{text}</p>
    </div>
  );
};
