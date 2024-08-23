import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";
interface LinkifyProps {
  children: React.ReactNode;
}
const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyHashtag>
      <LinkifyUsername>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyUsername>
    </LinkifyHashtag>
  );
};

export default Linkify;

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <UserLinkWithTooltip username={username}>{match}</UserLinkWithTooltip>
          // <p>hello</p>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/#[a-zA-Z0-9_]+/}
      component={(match, key) => {
        return (
          <Link
            key={key}
            href={`hashtag/${match.slice(1)}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
