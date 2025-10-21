import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Dashboard from "../pages/Dashboard.jsx";
import CommentSection from "../components/commentSection/CommentSection.jsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Dashboard">
                <Dashboard/>
            </ComponentPreview>
            <ComponentPreview path="/CommentSection">
                <CommentSection/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews