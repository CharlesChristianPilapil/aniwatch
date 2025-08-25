import { useEffect } from "react";
import { Helmet } from "react-helmet";

type Props = {
    title?: string,
    description?: string;
}

const PageTitle = ({
    title = "",
    description
}: Props) => {
    const fullTitle = `AniStream${title ? ` | ${title}` : ""}`;

    useEffect(() => {
        document.title = fullTitle;
    }, [fullTitle]);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            {description && <meta name="description" content={description} />}
        </Helmet>
    );
};

export default PageTitle;