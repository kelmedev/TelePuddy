"use client";

import { fabric } from "fabric";

import { useRef, useState, useEffect, MutableRefObject } from "react";

import Swal from "sweetalert2";

import {
  Download,
  Type,
  Trash2,
  Image,
  Bold,
  Underline,
  RectangleHorizontal,
  Triangle,
  Minus,
  Circle,
  LockKeyholeOpen,
  LockKeyhole,
  Square as SquareIcon,
  Plus,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter } from "next/navigation";
import api from "@/_services/API";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { ToolBar } from "../ui/toolbar";
import { useQueryClient } from "react-query";

interface ICanvaBuilderCreatorProps {
  idProject: string;
  type: string;
}

interface ProjectData {
  id: string;
  name: string;
  userId: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  json: any;
}

export function CanvaBuilderCreator({
  idProject,
  type,
}: ICanvaBuilderCreatorProps) {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const canvasInstance: MutableRefObject<fabric.Canvas | null> = useRef(null);
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [selectedFontSize, setSelectedFontSize] = useState<number>(36);
  const [selectedFontWeight, setSelectedFontWeight] =
    useState<string>("normal");
  const [selectedUnderline, setSelectedUnderline] = useState<boolean>(false);
  const [isTextSelected, setIsTextSelected] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [selectedStrokeColor, setSelectedStrokeColor] =
    useState<string>("#000000");
  const [strokeEnabled, setStrokeEnabled] = useState<boolean>(false);
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [isElementLocked, setIsElementLocked] = useState<boolean>(false);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [gradientEnabled, setGradientEnabled] = useState<boolean>(false);
  const [gradientColor1, setGradientColor1] = useState<string>("#ff0000");
  const [gradientColor2, setGradientColor2] = useState<string>("#0000ff");
  const [nameProject, setNameProject] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState<boolean>(false);

  const [adminName, setAdminName] = useState("");
  const [widthValue, setWidthValue] = useState("");
  const [heigthValue, setHeigthValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [adminModal, setAdminModal] = useState(false);

  const queryClient = useQueryClient();

  const { replace } = useRouter();

  const [validit, setValidit] = useState("");

  const { data: session } = useSession();
  const token = session?.authorization;

  useEffect(() => {
    const fetchProjectDataAdmin = async () => {
      setAdminModal(true);
    };

    const fetchProjectDataUser = async () => {
      try {
        const response = await api.post<ProjectData>(
          `/editor/my-project/${idProject}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const projectData = response.data;

        setNameProject(projectData.name);

        if (canvasInstance.current) {
          canvasInstance.current.setWidth(projectData.width);
          canvasInstance.current.setHeight(projectData.height);
        }

        if (Object.keys(projectData.json).length === 0) {
          await api.put(
            `/editor/update-project/${idProject}`,
            {
              json: JSON_TEMPLATE_VAZIO,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.setItem(
            "preferences-canva",
            JSON.stringify(JSON_TEMPLATE_VAZIO)
          );
        } else {
          loadCanvasFromJSON(JSON.stringify(projectData.json));
          localStorage.setItem(
            "preferences-canva",
            JSON.stringify(projectData.json)
          );
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    {
      type === "user" && fetchProjectDataUser();
    }
    {
      type === "admin" && fetchProjectDataAdmin();
    }
  }, [idProject, token]);

  useEffect(() => {
    if (validit === "ok") {
      if (canvasInstance.current) {
        canvasInstance.current.setWidth(widthValue);
        canvasInstance.current.setHeight(heigthValue);
      }
      setNameProject(adminName);
    }
  }, [validit]);

  const JSON_TEMPLATE_VAZIO = {
    version: "4.6.0",
    background: "#FFFFFF",
    objects: [],
  };

  const SendCanvaJSONAdmin = async () => {
    setIsLoadingAdmin(true);

    const JSON_PARSE = JSON.parse(
      localStorage.getItem("preferences-canva") ?? ""
    );

    try {
      if (canvasRef.current) {
        const dataURL = canvasRef.current.toDataURL("png");

        const response = await fetch(dataURL);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob, "canvas.png");

        const responseImage = await api.post("/image/upload/admin", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        const ImageId = responseImage.data.id;

        await api.post(
          "/editor/templates",
          {
            name: adminName,
            type: typeValue,
            width: widthValue,
            height: heigthValue,
            json: JSON_PARSE,
            imageId: ImageId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire("Sucesso!", "Template cadastrado com sucesso.", "success");
        replace("/admin/template-managment");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const SendCanvaJSON = async () => {
    setIsLoading(true);
    const JSON_PARSE = JSON.parse(
      localStorage.getItem("preferences-canva") ?? ""
    );

    try {
      canvasInstance.current?.discardActiveObject(); 
      canvasInstance.current?.renderAll();

      await api.put(
        `/editor/update-project/${idProject}`,
        {
          json: JSON_PARSE,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (canvasRef.current) {
        const dataURL = canvasRef.current.toDataURL("png");

        const response = await fetch(dataURL);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob, "canvas.png");
        formData.append("projectId", idProject);

        await api.post("/image/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error updating project data:", error);
    } finally {
      canvasInstance.current?.renderAll();

      Swal.fire({
        title: "Sucesso!",
        text: "Edições publicadas com sucesso",
        icon: "success",
        confirmButtonText: "Fechar",
      });
      setIsLoading(false);
      queryClient.invalidateQueries("get-all-logos");
      replace("/home");
    }
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const canvas = new fabric.Canvas(canvasElement, {
        backgroundColor: "#ffffff",
      });

      canvasInstance.current = canvas;

      saveCanvasToLocalStorage();

      canvas.on("object:modified", saveCanvasToLocalStorage);
      canvas.on("object:added", saveCanvasToLocalStorage);
      canvas.on("object:removed", saveCanvasToLocalStorage);

      canvas.on("mouse:wheel", function (opt) {
        const delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;

        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();

        const vpt = canvas.viewportTransform;

        if (vpt) {
          if (zoom < 400 / 1000) {
            vpt[4] = 200 - (1000 * zoom) / 2;
            vpt[5] = 200 - (1000 * zoom) / 2;
          } else {
            if (vpt[4] >= 0) {
              vpt[4] = 0;
            } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
              vpt[4] = canvas.getWidth() - 1000 * zoom;
            }
            if (vpt[5] >= 0) {
              vpt[5] = 0;
            } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
              vpt[5] = canvas.getHeight() - 1000 * zoom;
            }
          }
        }
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === "Delete" || e.key === "Backspace") && !inputFocused) {
          const activeObjects = canvas.getActiveObjects();
          const editingText = activeObjects.some(
            (obj) => (obj as fabric.IText).isEditing
          );

          if (!editingText && activeObjects.length) {
            activeObjects.forEach((obj) => canvas.remove(obj));
            canvas.discardActiveObject();
            canvas.renderAll();
          }
        }
      };

      canvas.on("mouse:dblclick", (opt) => {
        const target = opt.target;
        if (target && target.type === "i-text") {
          (target as fabric.IText).enterEditing();
        }
      });

      canvas.on("selection:created", updateFontSelection);
      canvas.on("selection:updated", updateFontSelection);
      canvas.on("selection:cleared", () => {
        setIsTextSelected(false);
        setGradientEnabled(false);
        const backgroundColor = canvas.backgroundColor as string;
        setSelectedColor(backgroundColor);
        localStorage.setItem("selected-color", backgroundColor);
      });

      window.addEventListener("keydown", handleKeyDown);

      addAligningGuidelines(canvas);

      return () => {
        canvas.dispose();
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [inputFocused]);

  const loadCanvasFromJSON = (json: string) => {
    if (canvasInstance.current) {
      canvasInstance.current.loadFromJSON(json, () => {
        canvasInstance.current?.renderAll();
      });
    }
  };

  const saveCanvasToLocalStorage = () => {
    if (canvasInstance.current) {
      const json = canvasInstance.current.toJSON();
      localStorage.setItem("preferences-canva", JSON.stringify(json));
    }
  };

  const updateFontSelection = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        setSelectedColor((activeObject as fabric.Object).fill as string);
        if (activeObject.type === "i-text") {
          setSelectedFont((activeObject as fabric.IText).fontFamily as string);
          setSelectedFontSize(
            (activeObject as fabric.IText).fontSize as number
          );
          setSelectedFontWeight(
            (activeObject as fabric.IText).fontWeight as string
          );
          setSelectedUnderline(
            (activeObject as fabric.IText).underline ?? false
          );
          setSelectedStrokeColor(
            (activeObject as fabric.IText).stroke as string
          );
          setStrokeEnabled((activeObject as fabric.IText).strokeWidth! > 0);
          setGradientEnabled(!!(activeObject as any).gradientEnabled);
          setGradientColor1((activeObject as any).gradientColor1 || "#ff0000");
          setGradientColor2((activeObject as any).gradientColor2 || "#0000ff");
          setIsTextSelected(true);
        } else if (
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line"
        ) {
          setSelectedColor((activeObject as fabric.Object).fill as string);
          setGradientEnabled(!!(activeObject as any).gradientEnabled);
          setGradientColor1((activeObject as any).gradientColor1 || "#ff0000");
          setGradientColor2((activeObject as any).gradientColor2 || "#0000ff");
          setStrokeEnabled((activeObject as fabric.Object).strokeWidth! > 0);
          setIsTextSelected(false);
        }
        setIsElementLocked(activeObject.lockMovementX || false);
        if (
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line"
        ) {
          setWidth(activeObject.getScaledWidth());
          setHeight(activeObject.getScaledHeight());
        } else {
          setWidth("");
          setHeight("");
        }
      } else {
        const backgroundColor = canvas.backgroundColor as string;
        setSelectedColor(backgroundColor);
        localStorage.setItem("selected-color", backgroundColor);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        addImageToCanvas(imageDataUrl);
        (e.target as HTMLInputElement).value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToCanvas = (url: string) => {
    fabric.Image.fromURL(url, (img) => {
      const canvas = canvasInstance.current;
      if (canvas) {
        const scaleFactor = Math.min(
          canvas.getWidth() / img.width!,
          canvas.getHeight() / img.height!,
          0.5
        );
        img.scale(scaleFactor);
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
        });
        canvas.add(img);
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    });
  };

  const addTextToCanvas = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const text = new fabric.IText("Novo Texto", {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        fontSize: 36,
        fontWeight: "normal",
        fontStyle: "normal",
        underline: false,
        fill: "#000000",
        stroke: strokeEnabled ? selectedStrokeColor : "",
        strokeWidth: strokeEnabled ? 2 : 0,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      setSelectedFontSize(36);
      setSelectedFontWeight("normal");
      setSelectedUnderline(false);
      saveCanvasToLocalStorage();
    }
  };

  const exportCanvasAsPNG = () => {
    if (canvasInstance.current) {
      const dataURL = canvasInstance.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 4,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportCanvasAsJSON = () => {
    if (canvasInstance.current) {
      const json = JSON.stringify(canvasInstance.current.toJSON());
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "canvas_data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const deleteSelectedObjects = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      const editingText = activeObjects.some(
        (obj) => (obj as fabric.IText).isEditing
      );

      if (!editingText && activeObjects.length) {
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const handleFontChange = (font: string) => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set("fontFamily", font);
        canvas.renderAll();
        saveCanvasToLocalStorage();
        setSelectedFont(font);
        if (!isFontWeightAvailable(font, selectedFontWeight)) {
          setSelectedFontWeight("normal");
          (activeObject as fabric.IText).set("fontWeight", "normal");
        }
      }
    }
  };

  const handleFontSizeChange = (fontSize: string) => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set("fontSize", parseInt(fontSize));
        canvas.renderAll();
        saveCanvasToLocalStorage();
        setSelectedFontSize(parseInt(fontSize));
      }
    }
  };

  const handleFontWeightChange = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        const newWeight =
          (activeObject as fabric.IText).fontWeight === "bold"
            ? "normal"
            : "bold";
        (activeObject as fabric.IText).set("fontWeight", newWeight);
        canvas.renderAll();
        saveCanvasToLocalStorage();
        setSelectedFontWeight(newWeight);
      }
    }
  };

  const handleUnderlineChange = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        const underline = !(activeObject as fabric.IText).underline;
        (activeObject as fabric.IText).set("underline", underline);
        canvas.renderAll();
        saveCanvasToLocalStorage();
        setSelectedUnderline(underline);
      }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    localStorage.setItem("selected-color", newColor);

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();

      if (activeObject && !gradientEnabled) {
        if (
          activeObject.type === "i-text" ||
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line"
        ) {
          activeObject.set("fill", newColor);
        }
        canvas.renderAll();
        saveCanvasToLocalStorage();
      } else {
        canvas.setBackgroundColor(newColor, () => {
          canvas.renderAll();
          saveCanvasToLocalStorage();
        });
      }
    }
  };

  const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrokeColor = e.target.value;
    setSelectedStrokeColor(newStrokeColor);
    localStorage.setItem("selected-stroke-color", newStrokeColor);

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();

      if (
        activeObject &&
        (activeObject.type === "i-text" ||
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line") &&
        strokeEnabled
      ) {
        activeObject.set("stroke", newStrokeColor);
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const handleStrokeEnabledChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const enabled = e.target.checked;
    setStrokeEnabled(enabled);
    localStorage.setItem("stroke-enabled", enabled.toString());

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (
        activeObject &&
        (activeObject.type === "i-text" ||
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line")
      ) {
        activeObject.set("strokeWidth", enabled ? 2 : 0);
        activeObject.set("stroke", enabled ? selectedStrokeColor : "");
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const handleGradientEnabledChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const enabled = e.target.checked;
    setGradientEnabled(enabled);
    localStorage.setItem("gradient-enabled", enabled.toString());

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (
        activeObject &&
        (activeObject.type === "i-text" ||
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line")
      ) {
        if (enabled) {
          const gradient = new fabric.Gradient({
            type: "linear",
            coords: {
              x1: 0,
              y1: 0,
              x2: activeObject.width || 0,
              y2: activeObject.height || 0,
            },
            colorStops: [
              { offset: 0, color: gradientColor1 },
              { offset: 1, color: gradientColor2 },
            ],
          });
          activeObject.set("fill", gradient);
          (activeObject as any).gradientEnabled = true;
          (activeObject as any).gradientColor1 = gradientColor1;
          (activeObject as any).gradientColor2 = gradientColor2;
        } else {
          (activeObject as any).gradientEnabled = false;
          (activeObject as any).gradientColor1 = undefined;
          (activeObject as any).gradientColor2 = undefined;
          activeObject.set("fill", selectedColor);
        }
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseFloat(e.target.value);
    if (isNaN(newWidth) || newWidth <= 0) return;
    setWidth(newWidth);

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type !== "i-text") {
        activeObject.set({
          scaleX: newWidth / (activeObject.width ?? 1),
        });
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseFloat(e.target.value);
    if (isNaN(newHeight) || newHeight <= 0) return;
    setHeight(newHeight);

    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type !== "i-text") {
        activeObject.set({
          scaleY: newHeight / (activeObject.height ?? 1),
        });
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  const addShapeToCanvas = (shapeType: string) => {
    const canvas = canvasInstance.current;
    if (canvas) {
      let shape;
      switch (shapeType) {
        case "rectangle":
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "red",
            width: 80,
            height: 60,
          });
          break;
        case "square":
          shape = new fabric.Rect({
            left: 100,
            top: 100,
            fill: "blue",
            width: 60,
            height: 60,
          });
          break;
        case "circle":
          shape = new fabric.Circle({
            left: 150,
            top: 150,
            fill: "green",
            radius: 50,
          });
          break;
        case "triangle":
          shape = new fabric.Triangle({
            left: 200,
            top: 200,
            fill: "blue",
            width: 60,
            height: 70,
          });
          break;
        case "line":
          shape = new fabric.Line([50, 100, 200, 100], {
            left: 50,
            top: 100,
            stroke: "black",
            strokeWidth: 2,
          });
          break;
        default:
          return;
      }
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      saveCanvasToLocalStorage();
      setSelectedShape("");
    }
  };

  const toggleLockObject = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const isLocked = !!activeObject.lockMovementX;
        activeObject.lockMovementX = !isLocked;
        activeObject.lockMovementY = !isLocked;
        activeObject.lockScalingX = !isLocked;
        activeObject.lockScalingY = !isLocked;
        activeObject.lockRotation = !isLocked;
        //@ts-ignore
        activeObject.editable = isLocked;
        canvas.renderAll();
        setIsElementLocked(!isLocked);
      }
    }
  };

  const isFontWeightAvailable = (font: string, weight: string | undefined) => {
    const availableWeights: { [key: string]: string[] } = {
      Arial: ["normal", "bold", "italic"],
      Helvetica: ["normal", "bold", "italic"],
      "Times New Roman": ["normal", "bold", "italic"],
      Georgia: ["normal", "bold", "italic"],
      Verdana: ["normal", "bold", "italic"],
      "Courier New": ["normal", "bold", "italic"],
      "Trebuchet MS": ["normal", "bold", "italic"],
      Impact: ["normal", "bold"],
      "Comic Sans MS": ["normal", "bold", "italic"],
      Palatino: ["normal", "bold", "italic"],
      Garamond: ["normal", "bold", "italic"],
      Bookman: ["normal", "bold", "italic"],
      "Arial Black": ["normal", "bold", "italic"],
      "Avant Garde": ["normal", "bold", "italic"],
      Gotham: ["normal", "bold", "italic"],
      Rockwell: ["normal", "bold", "italic"],
      Futura: ["normal", "bold", "italic"],
      Baskerville: ["normal", "bold", "italic"],
    };
    return availableWeights[font]?.includes(weight!) || false;
  };

  const addAligningGuidelines = (canvas: fabric.Canvas) => {
    const ctx = canvas.getSelectionContext();
    const aligningLineOffset = 5;
    const aligningLineMargin = 4;
    const aligningLineWidth = 1;
    const aligningLineColor = "rgb(255,0,0)";
    const viewportTransform = canvas.viewportTransform!;
    const zoom = canvas.getZoom();

    let verticalLines: any[] = [];
    let horizontalLines: any[] = [];

    const drawVerticalLine = (coords: number[]) => {
      drawLine(coords, "vertical");
    };

    const drawHorizontalLine = (coords: number[]) => {
      drawLine(coords, "horizontal");
    };

    const drawLine = (coords: number[], type: string) => {
      const startX = coords[0] * zoom + viewportTransform[4];
      const startY = coords[1] * zoom + viewportTransform[5];
      const endX = coords[2] * zoom + viewportTransform[4];
      const endY = coords[3] * zoom + viewportTransform[5];

      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    };

    const isInRange = (value1: number, value2: number) => {
      const a = Math.round(value1);
      const b = Math.round(value2);
      return a >= b - aligningLineMargin && a <= b + aligningLineMargin;
    };

    canvas.on("mouse:down", () => {
      verticalLines = [];
      horizontalLines = [];
    });

    canvas.on("object:moving", (target: any) => {
      const activeObject = target.target;
      const canvasObjects = canvas.getObjects();
      const activeObjectCenter = activeObject.getCenterPoint();
      const activeObjectLeft = activeObjectCenter.x;
      const activeObjectTop = activeObjectCenter.y;
      const activeObjectBoundingRect = activeObject.getBoundingRect();
      const activeObjectHeight =
        activeObjectBoundingRect.height / viewportTransform[3];
      const activeObjectWidth =
        activeObjectBoundingRect.width / viewportTransform[0];
      let horizontalInRange = false;
      let verticalInRange = false;

      for (let i = canvasObjects.length; i--; ) {
        if (canvasObjects[i] === activeObject) continue;

        const objectCenter = canvasObjects[i].getCenterPoint();
        const objectLeft = objectCenter.x;
        const objectTop = objectCenter.y;
        const objectBoundingRect = canvasObjects[i].getBoundingRect();
        const objectHeight = objectBoundingRect.height / viewportTransform[3];
        const objectWidth = objectBoundingRect.width / viewportTransform[0];

        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInRange = true;
          verticalLines.push([objectLeft, -5000, objectLeft, 5000]);
          activeObject.setPositionByOrigin(
            new fabric.Point(objectLeft, activeObjectTop),
            "center",
            "center"
          );
        }

        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInRange = true;
          horizontalLines.push([-5000, objectTop, 5000, objectTop]);
          activeObject.setPositionByOrigin(
            new fabric.Point(activeObjectLeft, objectTop),
            "center",
            "center"
          );
        }

        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2
          )
        ) {
          verticalInRange = true;
          verticalLines.push([
            objectLeft - objectWidth / 2,
            -5000,
            objectLeft - objectWidth / 2,
            5000,
          ]);
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft - objectWidth / 2 + activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2
          )
        ) {
          verticalInRange = true;
          verticalLines.push([
            objectLeft + objectWidth / 2,
            -5000,
            objectLeft + objectWidth / 2,
            5000,
          ]);
          activeObject.setPositionByOrigin(
            new fabric.Point(
              objectLeft + objectWidth / 2 - activeObjectWidth / 2,
              activeObjectTop
            ),
            "center",
            "center"
          );
        }

        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2
          )
        ) {
          horizontalInRange = true;
          horizontalLines.push([
            -5000,
            objectTop - objectHeight / 2,
            5000,
            objectTop - objectHeight / 2,
          ]);
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }

        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2
          )
        ) {
          horizontalInRange = true;
          horizontalLines.push([
            -5000,
            objectTop + objectHeight / 2,
            5000,
            objectTop + objectHeight / 2,
          ]);
          activeObject.setPositionByOrigin(
            new fabric.Point(
              activeObjectLeft,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            "center",
            "center"
          );
        }
      }

      if (!horizontalInRange) horizontalLines.length = 0;
      if (!verticalInRange) verticalLines.length = 0;
    });

    canvas.on("before:render", () => {
      //@ts-ignore
      canvas.clearContext(canvas.contextTop);
    });

    canvas.on("after:render", () => {
      for (let i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (let i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }
    });

    canvas.on("mouse:up", () => {
      verticalLines.length = 0;
      horizontalLines.length = 0;
      canvas.renderAll();
    });
  };

  const handleGradientColor1Change = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = e.target.value;
    setGradientColor1(newColor);
    applyGradient();
  };

  const handleGradientColor2Change = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newColor = e.target.value;
    setGradientColor2(newColor);
    applyGradient();
  };

  const applyGradient = () => {
    const canvas = canvasInstance.current;
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (
        activeObject &&
        gradientEnabled &&
        (activeObject.type === "i-text" ||
          activeObject.type === "rect" ||
          activeObject.type === "circle" ||
          activeObject.type === "triangle" ||
          activeObject.type === "line")
      ) {
        const gradient = new fabric.Gradient({
          type: "linear",
          coords: {
            x1: 0,
            y1: 0,
            x2: activeObject.width || 0,
            y2: activeObject.height || 0,
          },
          colorStops: [
            { offset: 0, color: gradientColor1 },
            { offset: 1, color: gradientColor2 },
          ],
        });
        activeObject.set("fill", gradient);
        (activeObject as any).gradientEnabled = true;
        (activeObject as any).gradientColor1 = gradientColor1;
        (activeObject as any).gradientColor2 = gradientColor2;
        canvas.renderAll();
        saveCanvasToLocalStorage();
      }
    }
  };

  return (
    <>
      <ToolBar isLinks={false} />
      <section className="border flex items-center justify-between h-14 pr-3 gap-3 sticky top-[30px] bg-white z-30">
        <div className="flex items-center h-full gap-3">
          <div className="flex items-center gap-1 h-full p-5">
            <h1>Projeto:</h1>
            <p className="text-purple-600">{nameProject}</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className="flex items-center justify-center border p-3 h-10 rounded cursor-pointer hover:bg-gray-100">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="upload-image"
            />
            <label
              htmlFor="upload-image"
              className="cursor-pointer"
              title="Adicionar imagem"
            >
              <Image />
            </label>
          </div>
          <div
            className="flex items-center justify-center border p-3 h-10 rounded cursor-pointer hover:bg-gray-100"
            title="Adicionar texto"
            onClick={addTextToCanvas}
          >
            <Type />
          </div>
          <div
            className="flex items-center justify-center border p-3 h-10 rounded cursor-pointer hover:bg-gray-100"
            onClick={deleteSelectedObjects}
            title="Deletar elemento"
          >
            <Trash2 />
          </div>
          <div
            className="flex items-center justify-center border p-3 h-10 rounded cursor-pointer hover:bg-gray-100"
            onClick={toggleLockObject}
            title="Bloquear/Desbloquear elemento"
          >
            {isElementLocked ? <LockKeyhole /> : <LockKeyholeOpen />}
          </div>
          <Select onValueChange={addShapeToCanvas} value={selectedShape}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Formas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangle">
                <RectangleHorizontal />
              </SelectItem>
              <SelectItem value="square">
                <SquareIcon />
              </SelectItem>
              <SelectItem value="circle">
                <Circle />
              </SelectItem>
              <SelectItem value="triangle">
                <Triangle />
              </SelectItem>
              <SelectItem value="line">
                <Minus />
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {type === "user" && (
            <Button
              onClick={SendCanvaJSON}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Publicando..."
              ) : (
                <>
                  <Download size={20} />
                  Publicar alterações
                </>
              )}
            </Button>
          )}
          {type === "admin" && (
            <Button
              onClick={SendCanvaJSONAdmin}
              className="flex items-center gap-2"
              disabled={isLoadingAdmin}
            >
              {isLoadingAdmin ? (
                "Criando..."
              ) : (
                <>
                  <Plus size={20} />
                  Criar template
                </>
              )}
            </Button>
          )}
        </div>
      </section>
      <div className="flex flex-1">
        <aside className="flex flex-col bg-[#14181f] h-[89vh] min-w-[320px] max-w-[320px] sticky top-[128px]">
          <div className="flex flex-col gap-3 pt-8 pl-5 pr-5 w-full">
            <p className="text-white text-xs font-medium">TEXTO</p>
            <Select
              value={selectedFont}
              onValueChange={handleFontChange}
              disabled={!isTextSelected}
            >
              <SelectTrigger className="bg-transparent border border-[#202731] text-white">
                <SelectValue placeholder="Arial" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                <SelectItem value="Palatino">Palatino</SelectItem>
                <SelectItem value="Garamond">Garamond</SelectItem>
                <SelectItem value="Bookman">Bookman</SelectItem>
                <SelectItem value="Arial Black">Arial Black</SelectItem>
                <SelectItem value="Avant Garde">Avant Garde</SelectItem>
                <SelectItem value="Gotham">Gotham</SelectItem>
                <SelectItem value="Rockwell">Rockwell</SelectItem>
                <SelectItem value="Futura">Futura</SelectItem>
                <SelectItem value="Baskerville">Baskerville</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select
                value={selectedFontSize?.toString()}
                onValueChange={handleFontSizeChange}
                disabled={!isTextSelected}
              >
                <SelectTrigger className="bg-transparent border border-[#202731] text-white">
                  <SelectValue placeholder="36" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="56">56</SelectItem>
                  <SelectItem value="64">64</SelectItem>
                  <SelectItem value="72">72</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleFontWeightChange}
                disabled={!isTextSelected}
                title="Definir como negrito"
              >
                <Bold />
              </Button>
              <Button
                onClick={handleUnderlineChange}
                disabled={!isTextSelected}
                title="Definir como sublinhado"
              >
                <Underline />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-8 pl-5 pr-5 w-full">
            <p className="text-white text-xs font-medium">COR</p>
            <Input
              type="color"
              className="bg-transparent border-none"
              value={selectedColor}
              onChange={handleColorChange}
              disabled={gradientEnabled}
            />
          </div>
          <div className="flex flex-col gap-3 pt-8 pl-5 pr-5 w-full">
            <div className="flex items-center justify-between">
              <p className="text-white text-xs font-medium">STROKE</p>
              <input
                type="checkbox"
                checked={strokeEnabled}
                onChange={handleStrokeEnabledChange}
                disabled={!isTextSelected}
              />
            </div>
            <Input
              type="color"
              className="bg-transparent border-none"
              value={selectedStrokeColor}
              onChange={handleStrokeColorChange}
              disabled={!isTextSelected || !strokeEnabled}
            />
          </div>
          <div className="flex flex-col gap-3 pt-8 pl-5 pr-5 w-full">
            <div className="flex items-center justify-between">
              <p className="text-white text-xs font-medium">GRADIENTE</p>
              <input
                type="checkbox"
                checked={gradientEnabled}
                onChange={handleGradientEnabledChange}
                disabled={!canvasInstance.current?.getActiveObject()}
              />
            </div>
            <Input
              type="color"
              className="bg-transparent border-none"
              value={gradientColor1}
              onChange={handleGradientColor1Change}
              disabled={!gradientEnabled}
            />
            <Input
              type="color"
              className="bg-transparent border-none"
              value={gradientColor2}
              onChange={handleGradientColor2Change}
              disabled={!gradientEnabled}
            />
          </div>
        </aside>
        <main className="flex flex-1 p-5 overflow-y-auto items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
          </div>
        </main>
      </div>
    </>
  );
}
