import MapBaseComponent from "../MapBaseComponent";
import {SpaghettiData, SpaghettiDiagram,createTimeRangeSlider} from '@flowide/leaflet-spaghetti-plugin';



class SpaghettiComponent extends MapBaseComponent {


    private spaghetti: SpaghettiDiagram | null = null;
    private timeRangeSlider = createTimeRangeSlider();

    constructor(props:any) {
        super(props);
        this.timeRangeSlider.addChangeHandler(values => {
            if(this.spaghetti)
              this.spaghetti.TimeInterval = {minimum:values[0],maximum:values[1]};
        });
    }

    async setupComponent() : Promise<boolean> {
        if(!this.map) return false;

        if(this.spaghetti)
            this.spaghetti.removeFrom(this.map);
        
        const spaghettiData = this.toSpaghettiData() ?? {id:'1',data:[]}

        this.spaghetti = new SpaghettiDiagram(spaghettiData)
        this.spaghetti.addTo(this.map);
        this.timeRangeSlider.addTo(this.map);

        if(spaghettiData.data.length > 1) {
            this.timeRangeSlider.Options = {
                ...this.timeRangeSlider.Options,
                defaultRange:[spaghettiData.data[0].time as number,spaghettiData.data[spaghettiData.data.length -1].time as number]
            }
        }

        return true;
    }

    async processData() {
        if (this.spaghetti) {
            const spaghettiData = this.toSpaghettiData() ?? {id:'1',data:[]};
            this.spaghetti.Data = spaghettiData;
            if(spaghettiData.data.length > 1) {
                this.timeRangeSlider.Options = {
                    ...this.timeRangeSlider.Options,
                    defaultRange:[spaghettiData.data[0].time as number,spaghettiData.data[spaghettiData.data.length -1].time as number]
                }
            };
        }
    }

    private toSpaghettiData() : SpaghettiData | null {
        if (!this.props.args["data"]) return null;

        const spaghetti: SpaghettiData = {
            id:this.props.args["id"] || 'spaghetti',
            data:[]
        };
        (this.props.args["data"] as Array<[number,number,number]>).forEach(data => {
            spaghetti.data.push({
                position:[data[0],data[1]],
                time:data[2]
            })
        })

        return spaghetti;
    }

}

export default SpaghettiComponent