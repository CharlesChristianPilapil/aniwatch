import { Link } from "react-router-dom";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
    const contact = {
        'email': 'charleschristian.pilapil@gmail.com',
        'phone': '(63+) 947 197 0838',
    }

    return (
        <footer className="bg-black/10 py-10 mt-10">
            <div className="container grid lg:grid-cols-[1fr_3fr] gap-y-10">
                <Link to="/" className="hover:text-secondary-accent w-fit"> <h2 className="font-semibold text-2xl"> AnimeWatch </h2> </Link>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
                    <div className="space-y-4">
                        <h2 className="font-semibold"> About </h2>
                        <p className="max-w-[300px]"> A simple anime streaming site built for educational and project purposes only. </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-semibold"> Contact </h2>
                        <div className="flex flex-col gap-1">
                            <Link to={`mailto:${contact.email}`} className="w-fit"> {contact.email} </Link>
                            <Link to={`tel:${contact.phone}`} className="w-fit"> {contact.phone} </Link>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-semibold"> Socials </h2>
                        <div className="flex gap-1">
                            <Link to={"/"} target="_blank" aria-label="link to creator's linkedin"> 
                                <LinkedInIcon className="h-10 w-10 p-0 hover:text-secondary-accent"/> 
                            </Link>
                            <Link to={"/"} target="_blank" aria-label="link to creator's instagram"> 
                                <InstagramIcon className="h-10 w-10 p-0 hover:text-secondary-accent"/> 
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer