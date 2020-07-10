<%@ WebHandler Language="C#" Class="SaveFiles" %>

using System.Web;
using System.IO;

public class SaveFiles : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string targetFolder = HttpContext.Current.Server.MapPath("UploadFiles");
        if (!Directory.Exists(targetFolder)) 
        {
            Directory.CreateDirectory(targetFolder);
        }
        if (context.Request.UrlReferrer != null)
        {
            string requestPath = context.Request.UrlReferrer.AbsolutePath;
            HttpFileCollection uploadedFiles = context.Request.Files;
            if (uploadedFiles.Count > 0)
            {
                for (int i = 0; i < uploadedFiles.Count; i++)
                {
                    if (uploadedFiles[i].FileName != "")
                    {
                        try
                        {
                            var file = context.Request.Files[i];
                            string strFileName = file.FileName;
                            string path = context.Server.MapPath("~/UploadFiles/");
                            if (!Directory.Exists(path))
                                Directory.CreateDirectory(path);
                            var fileName = Path.Combine(path, strFileName);
                            file.SaveAs(fileName);
                            context.Response.Write("<span id='successmsg'> Successfully uploaded</span>");
                        }
                        catch (System.Exception exception)
                        {
                           context.Response.Write(exception.Message);
                        }
                    }
                }
            }
            else
            {
                // only for Synchronous upload functionalities 
                if (requestPath.Contains("my_datasets.html") || requestPath.Contains("SaveFiles.ashx"))
                {
                    context.Response.Write("<span id='successmsg'> Select file to upload</span>");
                    context.Response.WriteFile("my_datasets.html");
                }
            }
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}