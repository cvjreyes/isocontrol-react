//Caja de comentarios donde se escribe información referente al tratamiento de un archivo

const CommentBox = () =>{
    return(
        <div>
            <textarea placeholder="Comments" class="comments" cols="100" rows="2" required="" maxlength="400" name="comments"></textarea>
        </div>
    );
};

export default CommentBox;