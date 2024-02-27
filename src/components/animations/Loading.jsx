import Lottie from "lottie-react";
import rocket from "../../assets/lootie/rocket.json";
import { StyledLoading } from "./styles";

const Loading = () => (
  <StyledLoading>
    <Lottie
      animationData={rocket}
      loop={true}
      style={{
        width: "125px",
      }}
    />
  </StyledLoading>
);

export default Loading;
