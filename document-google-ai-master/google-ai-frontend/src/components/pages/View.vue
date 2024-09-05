<template>
  <b-overlay :show="loading" rounded="sm">
    <b-container fluid>
      <b-form-select v-model="drawMode">
        <b-form-select-option :value="null">Please select an option</b-form-select-option>
        <b-form-select-option v-for="mode in Modes" :value="mode">{{ mode }}</b-form-select-option>

      </b-form-select>
      <b-button @click="Save">Save</b-button>
      <b-modal id="edit-modal" size="lg" title="Edit" ok-only no-stacking>

        <b-form>
          <b-form-textarea v-if="selectedDraw" v-model="selectedDraw.text"></b-form-textarea>
        </b-form>
      </b-modal>
      <b-container fluid>
        <easel-canvas :width="imgWidth" :height="imgHeight" v-if="this.imgHeight >0">
          <easel-bitmap
            :image="imageBytes"
            :x="0"
            :y="0"
            :align="['left','top']"
          >

          </easel-bitmap>
          <easel-shape v-for="drawable in ToDraw"
                       form="rect"

                       :alpha=".8"
                       :dimensions="[GetVertex(drawable).width,GetVertex(drawable).height]"
                       :x="GetVertex(drawable).x"
                       :y="GetVertex(drawable).y"
                       :fill="fillColor"

                       @click="shapeClick(drawable)"
          >
          </easel-shape>
          <easel-text v-for="drawable in ToDraw"
                      :text="drawable.text"
                      :x="GetVertex(drawable).CenterX"
                      :y="GetVertex(drawable).CenterY"
                      font="12px Calibri"
                      :color="textColor"

                      :shadow="['#000088',3,2,3]"
                      :align="['middle', 'center']"
          >
          </easel-text>
        </easel-canvas>
      </b-container>
      <user-messages :error="error" :message="userMessage" />

      <b-row>
        <b-col cols="12">

        </b-col>
        <b-col cols="3">
          <b-card v-for="page in json.data.pages">
            <b-card-text v-for="key in Object.keys(page).filter(a=>Array.isArray(page[a]))">

            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <b-container fluid v-if="!loading && !error">
        <b-row>

          <b-col cols="12" style="display:none">


            <b-card-img ref="scannedImg" id="mona" :src="imageBytes" alt="" />
          </b-col>
        </b-row>

      </b-container>

    </b-container>
  </b-overlay>
</template>

<script setup>
import { Component, Vue } from "vue-property-decorator";
//@ts-ignore
import vueJsonEditor from "vue-json-editor";
import { Load, Update } from "@/views/upload.api";
import UserMessages from "@/views/UserMessages.vue";

interface IData {
  pages: Array<IHasBounding>;
}

interface IVertex {
  x: number;
  y: number;
}

interface IBoundPoly {
  vertices: Array<IVertex>;
  normalizedVertices: Array<IVertex>;
  orientation: Array<IVertex>;
}

interface ITextSegment {
  startIndex: number;
  endIndex: number;
}

interface ITextAnchor {
  textSegments: ITextSegment;
  boundingPoly: IBoundPoly;
}

interface IAmLayout {
  textAnchor: ITextAnchor;
  boundingPoly: IBoundPoly;
}

interface IHasVectors {
  Section: string;
  layout: IAmLayout;
  text: string;
}

interface IHasBounding {
  [key: string]: IHasVectors;
}

interface IJsonData {
  text: string;

  data: IData;

}

@Component({
  components: {
    UserMessages,
    vueJsonEditor
  }
})

export default class ViewView extends Vue {

  get ToDraw(): IHasVectors[] {
    return this.drawAble.filter(a => a.Section == this.drawMode);
  }

  private drawAble: IHasVectors[] = [];
  private drawMode: string | null = null;
  selectedDraw: IHasVectors | null = null;

  shapeClick(draw: IHasVectors) {
    this.selectedDraw = draw;
    this.$bvModal.show("edit-modal");

  }

  get Modes() {
    return new Set(this.drawAble.map(a => a.Section));
  }

  imgWidth: number = 0;
  imgHeight: number = 0;
  Mode: string = "";

  GetVertex(item: IHasVectors) {

    let width = (item.layout.boundingPoly.normalizedVertices[1].x - item.layout.boundingPoly.normalizedVertices[0].x) * this.imgWidth;
    let height = (item.layout.boundingPoly.normalizedVertices[2].y - item.layout.boundingPoly.normalizedVertices[0].y) * this.imgHeight;
    let newVar = {
      x: item.layout.boundingPoly.normalizedVertices[0].x * this.imgWidth,
      CenterY: item.layout.boundingPoly.normalizedVertices[0].y * this.imgHeight + height / 2,
      CenterX: item.layout.boundingPoly.normalizedVertices[0].x * this.imgWidth + width / 2,
      y: item.layout.boundingPoly.normalizedVertices[0].y * this.imgHeight,
      height: height,
      width: width
    };
    console.log(newVar);
    return newVar;
  }

  fillColor: string = "#968058";
  textColor: string = "#d7b40c";

  async created() {
    this.loading = true;


    try {
      this.userMessage = "Loading...";
      this.id = +this.$route.params["id"];
      const message = await Load(this.id);
      if (message == null) {
        this.userMessage = "Could not load from api";

        return;

      }
      this.json = JSON.parse(message.jsonResult);
      this.imageBytes = message.imageData;

      this.userMessage = "Loaded";
      setTimeout(() => {
        this.userMessage = "";
        const scannedImg = this.$refs.scannedImg as HTMLImageElement;
        this.imgHeight = scannedImg.height;
        this.imgWidth = scannedImg.width;
        this.drawAble = [];

        for (const page of this.json.data.pages)
          for (const key of Object.keys(page)) {
            const item = page[key];
            console.log(item);
            if (Array.isArray(item)) {
              for (const subItem of item)
                if (this.isObject(subItem) && this.IsLayout(subItem))
                  this.DrawOne(subItem, key);
            } else if (this.isObject(item) && this.IsLayout(item))
              this.DrawOne(item, key);
          }


      }, 700);
    } catch (e: any) {
      this.error = true;
      this.userMessage = e.message;
    }
    this.loading = false;
  }

  private IsLayout(subItem: any) {
    return Object.keys(subItem).indexOf("layout") >= 0;
  }

  showImage: boolean = false;
  loading: boolean = false;
  id: number = 0;
  json: IJsonData = { data: { pages: [] }, text: "" };
  userMessage: string = "";
  error: boolean = false;
  imageBytes: string = "";

  async DrawOne(displayAble: IHasVectors, key: string) {
    displayAble.Section = key;
    this.drawAble.push(displayAble);


  }

  async Save() {
    try {
      debugger;
      this.userMessage = "";
      await Update(this.id, JSON.stringify(this.json));
      this.userMessage = "Updated";
    } catch (e: any) {
      this.userMessage = e.message;
      this.error = true;
    }

  }

  isObject = (obj: any) => obj === Object(obj);
}

</script>
