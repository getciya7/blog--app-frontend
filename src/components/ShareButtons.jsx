import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";

const ShareButtons = ({ url, title }) => (
  <div className="flex space-x-2">
    <FacebookShareButton url={url} quote={title}>
      <FacebookIcon size={24} round />
    </FacebookShareButton>
    <TwitterShareButton url={url} title={title}>
      <TwitterIcon size={24} round />
    </TwitterShareButton>
    <WhatsappShareButton url={url} title={title}>
      <WhatsappIcon size={24} round />
    </WhatsappShareButton>
    <LinkedinShareButton url={url} title={title}>
      <LinkedinIcon size={24} round />
    </LinkedinShareButton>
    <TelegramShareButton url={url} title={title}>
      <TelegramIcon size={24} round />
    </TelegramShareButton>
  </div>
);

export default ShareButtons;
